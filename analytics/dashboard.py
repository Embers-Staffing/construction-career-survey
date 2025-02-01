import streamlit as st
import pandas as pd
import plotly.express as px
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

# Title
st.title("Construction Career Survey Analytics")

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
            # Convert Firestore timestamp to datetime
            if 'timestamp' in data:
                data['timestamp'] = data['timestamp'].datetime()
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
        
        # Dashboard layout
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Survey Response Trends")
            # Daily response counts
            daily_responses = df.resample('D', on='timestamp').size()
            fig_trend = px.line(
                daily_responses,
                title="Daily Survey Responses",
                labels={"value": "Responses", "timestamp": "Date"}
            )
            st.plotly_chart(fig_trend, use_container_width=True)
        
        with col2:
            st.subheader("Career Path Distribution")
            # Count recommendations
            all_recommendations = []
            for recs in df['recommendations'].dropna():
                if isinstance(recs, list):
                    all_recommendations.extend(recs)
            
            rec_counts = pd.Series(all_recommendations).value_counts()
            fig_paths = px.pie(
                values=rec_counts.values,
                names=rec_counts.index,
                title="Recommended Career Paths"
            )
            st.plotly_chart(fig_paths, use_container_width=True)
        
        # Holland Code Analysis
        st.subheader("Holland Code Distribution")
        holland_codes = df['survey_data'].apply(
            lambda x: x.get('holland_code') if isinstance(x, dict) else None
        ).dropna()
        
        if not holland_codes.empty:
            fig_holland = px.bar(
                holland_codes.value_counts(),
                title="Holland Code Distribution",
                labels={"value": "Count", "index": "Holland Code"}
            )
            st.plotly_chart(fig_holland, use_container_width=True)
        
        # MBTI Type Analysis
        st.subheader("MBTI Type Distribution")
        mbti_types = df['survey_data'].apply(
            lambda x: x.get('mbti_type') if isinstance(x, dict) else None
        ).dropna()
        
        if not mbti_types.empty:
            fig_mbti = px.bar(
                mbti_types.value_counts(),
                title="MBTI Type Distribution",
                labels={"value": "Count", "index": "MBTI Type"}
            )
            st.plotly_chart(fig_mbti, use_container_width=True)
        
        # Raw Data Table
        st.subheader("Raw Survey Data")
        st.dataframe(
            df[[
                'timestamp',
                'participant_info',
                'survey_data',
                'recommendations'
            ]].sort_values('timestamp', ascending=False),
            use_container_width=True
        )

except Exception as e:
    st.error(f"Error loading data: {str(e)}")
    logger.error(f"Error loading data: {str(e)}", exc_info=True)
    st.stop()
