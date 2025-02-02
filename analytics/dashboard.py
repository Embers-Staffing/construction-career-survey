import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import logging
from firebase_admin import firestore
from config import init_firebase
from datetime import datetime, timedelta

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Firebase
try:
    logger.debug("Initializing Firebase...")
    init_firebase()
    db = firestore.client()
    logger.debug("Firebase initialized successfully")
except Exception as e:
    st.error(f"Failed to initialize Firebase: {str(e)}")
    logger.error(f"Firebase initialization error: {str(e)}", exc_info=True)
    st.stop()

# Page config
st.set_page_config(
    page_title="Construction Career Survey Analytics",
    page_icon="🏗️",
    layout="wide"
)

# Title and description
st.title("Construction Career Survey Analytics")
st.markdown("""
This dashboard provides insights into construction career survey responses and recommendations.
Use the filters in the sidebar to analyze specific time periods and participant segments.
""")

# Sidebar filters
st.sidebar.header("Filters")

# Date range filter
def get_date_range():
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)  # Default to last 30 days
    
    start = st.sidebar.date_input("Start Date", start_date)
    end = st.sidebar.date_input("End Date", end_date)
    
    return start, end

start_date, end_date = get_date_range()

# Function to load data
@st.cache_data(ttl=300)  # Cache for 5 minutes
def load_survey_data():
    try:
        responses = []
        docs = db.collection('survey_responses').get()
        
        for doc in docs:
            data = doc.to_dict()
            # Add document ID
            data['id'] = doc.id
            # Convert Firestore timestamp to datetime
            if 'timestamp' in data:
                data['timestamp'] = pd.to_datetime(data['timestamp'])
            responses.append(data)
        
        return pd.DataFrame(responses)
    except Exception as e:
        logger.error(f"Error loading survey data: {str(e)}", exc_info=True)
        return pd.DataFrame()

# Load data
try:
    df = load_survey_data()
    
    if df.empty:
        st.warning("No survey responses found in the database.")
    else:
        # Filter by date range
        df = df[
            (df['timestamp'].dt.date >= start_date) &
            (df['timestamp'].dt.date <= end_date)
        ]
        
        # Overview metrics
        st.header("Overview")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Responses", len(df))
        
        with col2:
            responses_today = len(df[df['timestamp'].dt.date == datetime.now().date()])
            st.metric("Responses Today", responses_today)
        
        with col3:
            avg_daily = len(df) / ((end_date - start_date).days + 1)
            st.metric("Avg. Daily Responses", f"{avg_daily:.1f}")
        
        with col4:
            completion_rate = (df['status'] == 'completed').mean() * 100
            st.metric("Completion Rate", f"{completion_rate:.1f}%")
        
        # Response Trends
        st.header("Response Analysis")
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Survey Response Trends")
            if not df.empty:
                daily_responses = df.resample('D', on='timestamp').size()
                fig_trend = px.line(
                    daily_responses,
                    title="Daily Survey Responses",
                    labels={"value": "Responses", "timestamp": "Date"}
                )
                st.plotly_chart(fig_trend, use_container_width=True)
            else:
                st.info("No survey responses available for the selected date range.")
        
        with col2:
            st.subheader("Response Time Distribution")
            if not df.empty:
                df['hour'] = df['timestamp'].dt.hour
                hourly_dist = df['hour'].value_counts().sort_index()
                fig_hours = px.bar(
                    hourly_dist,
                    title="Response Time Distribution (24h)",
                    labels={"value": "Count", "index": "Hour of Day"}
                )
                st.plotly_chart(fig_hours, use_container_width=True)
            else:
                st.info("No survey responses available for the selected date range.")
        
        # Personality Analysis
        st.header("Personality Insights")
        if df.empty:
            st.info("No survey responses available for the selected date range.")
        else:
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("Holland Code Distribution")
                if 'holland_code' in df.columns and not df['holland_code'].empty:
                    holland_codes = df['holland_code'].value_counts()
                    fig_holland = px.pie(
                        values=holland_codes.values,
                        names=holland_codes.index,
                        title="Holland Code Distribution"
                    )
                    st.plotly_chart(fig_holland, use_container_width=True)
                    
                    # Holland Code Trends
                    holland_trends = pd.crosstab(
                        df['timestamp'].dt.to_period('M'),
                        df['holland_code']
                    ).reset_index()
                    holland_trends['timestamp'] = holland_trends['timestamp'].astype(str)
                    fig_holland_trend = px.line(
                        holland_trends.melt(id_vars=['timestamp']),
                        x='timestamp',
                        y='value',
                        color='holland_code',
                        title="Holland Code Trends Over Time"
                    )
                    st.plotly_chart(fig_holland_trend, use_container_width=True)
                else:
                    st.info("No Holland Code data available.")
            
            with col2:
                st.subheader("MBTI Type Distribution")
                if 'mbti_type' in df.columns and not df['mbti_type'].empty:
                    mbti_types = df['mbti_type'].value_counts()
                    fig_mbti = px.pie(
                        values=mbti_types.values,
                        names=mbti_types.index,
                        title="MBTI Type Distribution"
                    )
                    st.plotly_chart(fig_mbti, use_container_width=True)
                    
                    # MBTI Trends
                    mbti_trends = pd.crosstab(
                        df['timestamp'].dt.to_period('M'),
                        df['mbti_type']
                    ).reset_index()
                    mbti_trends['timestamp'] = mbti_trends['timestamp'].astype(str)
                    fig_mbti_trend = px.line(
                        mbti_trends.melt(id_vars=['timestamp']),
                        x='timestamp',
                        y='value',
                        color='mbti_type',
                        title="MBTI Type Trends Over Time"
                    )
                    st.plotly_chart(fig_mbti_trend, use_container_width=True)
                else:
                    st.info("No MBTI Type data available.")
        
        # Career Recommendations Analysis
        st.header("Career Recommendations")
        
        # Function to extract job titles from recommendations
        def get_job_titles(recommendations):
            try:
                if not recommendations:
                    return []
                holland_recs = recommendations.get('hollandRecs', {}).get('job_titles', [])
                mbti_recs = recommendations.get('mbtiRecs', {}).get('job_titles', [])
                return list(set(holland_recs + mbti_recs))
            except Exception as e:
                logger.error(f"Error extracting job titles: {str(e)}")
                return []

        if df.empty:
            st.info("No survey responses available for the selected date range.")
        else:
            # Analyze recommended jobs
            all_jobs = []
            for _, row in df.iterrows():
                all_jobs.extend(get_job_titles(row.get('recommendations', {})))
            
            if all_jobs:
                # Count job frequencies
                job_counts = pd.Series(all_jobs).value_counts()
                
                # Top recommended jobs
                st.subheader("Top Recommended Careers")
                fig_jobs = px.bar(
                    x=job_counts.index[:10],  # Top 10 jobs
                    y=job_counts.values[:10],
                    title="Most Frequently Recommended Careers",
                    labels={"x": "Career", "y": "Frequency"}
                )
                st.plotly_chart(fig_jobs, use_container_width=True)
            else:
                st.info("No career recommendations available for the selected responses.")
        
        # Raw Data Table
        st.header("Raw Data")
        if st.checkbox("Show Raw Data"):
            st.dataframe(
                df[[
                    'id',
                    'timestamp',
                    'holland_code',
                    'mbti_type',
                    'status'
                ]].sort_values('timestamp', ascending=False),
                use_container_width=True
            )

except Exception as e:
    st.error(f"Error loading data: {str(e)}")
    logger.error(f"Error loading data: {str(e)}", exc_info=True)
    st.stop()
