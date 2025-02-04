import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timezone, timedelta
from firebase_admin import firestore
from config import init_firebase
from collections import defaultdict
import numpy as np

# Initialize Firebase
init_firebase()
db = firestore.client()

# Set page config
st.set_page_config(page_title="Construction Career Survey Analytics", layout="wide")

# Add title and description
st.title("Construction Career Survey Analytics")
st.markdown("Comprehensive analysis of survey responses and career recommendations")

# Function to safely get nested dictionary values
def get_nested(data, *keys, default=None):
    try:
        for key in keys:
            data = data[key]
        return data
    except (KeyError, TypeError):
        return default

# Function to parse timestamp
def parse_timestamp(timestamp):
    if isinstance(timestamp, str):
        try:
            return pd.to_datetime(timestamp).tz_localize('UTC')
        except:
            return pd.Timestamp.now(tz='UTC')
    elif isinstance(timestamp, datetime):
        if timestamp.tzinfo is None:
            return timestamp.replace(tzinfo=timezone.utc)
        return timestamp
    else:
        return pd.Timestamp.now(tz='UTC')

# Function to clean certification level data
def clean_certification_level(level):
    if pd.isna(level) or level == '':
        return 'None'
    # Convert numeric strings to integers
    try:
        if str(level).isdigit():
            return 'Level ' + str(int(level))
    except:
        pass
    # Clean up text values
    level = str(level).lower().strip()
    if level in ['0', 'none', 'no certification']:
        return 'None'
    elif level in ['1', 'basic', 'beginner']:
        return 'Basic'
    elif level in ['2', 'intermediate']:
        return 'Intermediate'
    elif level in ['3', 'advanced', 'expert']:
        return 'Advanced'
    else:
        return 'Other'

# Function to load data from Firestore
def load_survey_data():
    survey_ref = db.collection('survey_responses')
    docs = survey_ref.stream()
    
    data = []
    for doc in docs:
        doc_data = doc.to_dict()
        timestamp = parse_timestamp(get_nested(doc_data, 'timestamp', default=datetime.now(timezone.utc)))
        
        # Clean certification level
        cert_level = get_nested(doc_data, 'skillsProfile', 'certificationLevel', default='')
        cleaned_cert_level = clean_certification_level(cert_level)
        
        flattened_data = {
            # Personal Profile
            'firstName': get_nested(doc_data, 'personalProfile', 'firstName', default=''),
            'lastName': get_nested(doc_data, 'personalProfile', 'lastName', default=''),
            'birthYear': get_nested(doc_data, 'personalProfile', 'birthYear', default=0),
            'birthMonth': get_nested(doc_data, 'personalProfile', 'birthMonth', default=0),
            'constructionExperience': get_nested(doc_data, 'personalProfile', 'constructionExperience', default=''),
            
            # Personality Profile
            'mbtiType': get_nested(doc_data, 'personalityProfile', 'mbtiType', default=''),
            'hollandCode': ','.join(get_nested(doc_data, 'personalityProfile', 'hollandCode', default=[])),
            
            # Skills Profile
            'technicalSkills': ','.join(get_nested(doc_data, 'skillsProfile', 'technicalSkills', default=[])),
            'certificationLevel': cleaned_cert_level,
            
            # Work Preferences
            'careerInterests': ','.join(get_nested(doc_data, 'workPreferences', 'careerInterests', default=[])),
            'techInterests': ','.join(get_nested(doc_data, 'workPreferences', 'techInterests', default=[])),
            'environmentPreference': get_nested(doc_data, 'workPreferences', 'environmentPreference', default=''),
            'travelWillingness': get_nested(doc_data, 'workPreferences', 'travelWillingness', default=''),
            
            # Goals Profile
            'careerGoals': ','.join(get_nested(doc_data, 'goalsProfile', 'careerGoals', default=[])),
            'salaryTarget': get_nested(doc_data, 'goalsProfile', 'salaryTarget', default=''),
            'advancementPreference': get_nested(doc_data, 'goalsProfile', 'advancementPreference', default=''),
            'mentorshipType': get_nested(doc_data, 'goalsProfile', 'mentorshipType', default=''),
            
            # Metadata
            'timestamp': timestamp
        }
        data.append(flattened_data)
    
    df = pd.DataFrame(data)
    
    # Convert timestamp to pandas datetime with UTC timezone
    df['timestamp'] = pd.to_datetime(df['timestamp'], utc=True)
    
    return df

# Load the data
try:
    df = load_survey_data()
    if len(df) == 0:
        st.warning("No survey responses found. Please add some responses to see the analytics.")
        st.stop()
except Exception as e:
    st.error(f"Error loading data: {str(e)}")
    st.stop()

# Add date filter
st.sidebar.header("Filters")
date_range = st.sidebar.date_input(
    "Date Range",
    value=(datetime.now(timezone.utc) - timedelta(days=30), datetime.now(timezone.utc))
)

# Convert date_range to datetime for filtering
start_date = datetime.combine(date_range[0], datetime.min.time(), tzinfo=timezone.utc)
end_date = datetime.combine(date_range[1], datetime.max.time(), tzinfo=timezone.utc)

# Filter data by date
df_filtered = df[(df['timestamp'] >= start_date) & (df['timestamp'] <= end_date)]

# Display total responses
st.sidebar.metric("Total Responses", len(df_filtered))

# Create tabs for different sections
tabs = st.tabs([
    "Overview",
    "Personal Profile",
    "Personality & Skills",
    "Skills & Experience",
    "Work Preferences",
    "Goals & Development",
    "Analytics"  # New tab
])

# Overview Tab
with tabs[0]:
    st.header("Survey Overview")
    col1, col2 = st.columns(2)
    
    with col1:
        # Responses over time
        daily_responses = df_filtered.groupby(df_filtered['timestamp'].dt.date).size().reset_index()
        daily_responses.columns = ['date', 'count']
        fig_timeline = px.line(
            daily_responses,
            x='date',
            y='count',
            title="Daily Survey Responses"
        )
        st.plotly_chart(fig_timeline, use_container_width=True)
    
    with col2:
        # Career advancement preferences
        advancement_counts = df_filtered['advancementPreference'].value_counts()
        fig_advancement = px.bar(
            x=advancement_counts.values,
            y=advancement_counts.index,
            title="Career Advancement Preferences",
            orientation='h',
            labels={'x': 'Number of Responses', 'y': 'Preference'}
        )
        fig_advancement.update_traces(texttemplate='%{x}', textposition='outside')
        st.plotly_chart(fig_advancement, use_container_width=True)

# Personal Profile Tab
with tabs[1]:
    st.header("Personal Profile Analysis")
    col1, col2 = st.columns(2)
    
    with col1:
        # Age distribution
        df_filtered['age'] = 2025 - pd.to_numeric(df_filtered['birthYear'])
        fig_age = px.histogram(
            df_filtered,
            x='age',
            title="Age Distribution",
            nbins=20
        )
        st.plotly_chart(fig_age, use_container_width=True)
    
    with col2:
        # Construction experience
        fig_exp = px.bar(
            df_filtered['constructionExperience'].value_counts(),
            title="Years of Construction Experience"
        )
        st.plotly_chart(fig_exp, use_container_width=True)

# Personality Insights Tab
with tabs[2]:
    st.header("Personality Insights")
    col1, col2 = st.columns(2)
    
    with col1:
        # MBTI distribution
        fig_mbti = px.bar(
            df_filtered['mbtiType'].value_counts(),
            title="MBTI Type Distribution"
        )
        st.plotly_chart(fig_mbti, use_container_width=True)
    
    with col2:
        # Holland Code distribution
        holland_codes = df_filtered['hollandCode'].str.split(',', expand=True).stack()
        fig_holland = px.bar(
            holland_codes.value_counts(),
            title="Holland Code Distribution"
        )
        st.plotly_chart(fig_holland, use_container_width=True)

# Skills Analysis Tab
with tabs[3]:
    st.header("Skills & Certifications")
    col1, col2 = st.columns(2)
    
    with col1:
        # Technical skills distribution
        skills = df_filtered['technicalSkills'].str.split(',', expand=True).stack()
        fig_skills = px.bar(
            skills.value_counts(),
            title="Technical Skills Distribution"
        )
        st.plotly_chart(fig_skills, use_container_width=True)
    
    with col2:
        # Certification levels
        cert_counts = df_filtered['certificationLevel'].value_counts()
        fig_cert = px.bar(
            x=cert_counts.values,
            y=cert_counts.index,
            title="Certification Levels",
            orientation='h',
            labels={'x': 'Number of Responses', 'y': 'Level'}
        )
        fig_cert.update_traces(texttemplate='%{x}', textposition='outside')
        st.plotly_chart(fig_cert, use_container_width=True)

# Work Preferences Tab
with tabs[4]:
    st.header("Work Preferences")
    col1, col2 = st.columns(2)
    
    with col1:
        # Environment preferences
        env_counts = df_filtered['environmentPreference'].value_counts()
        fig_env = px.bar(
            x=env_counts.values,
            y=env_counts.index,
            title="Work Environment Preferences",
            orientation='h',
            labels={'x': 'Number of Responses', 'y': 'Environment'}
        )
        fig_env.update_traces(texttemplate='%{x}', textposition='outside')
        st.plotly_chart(fig_env, use_container_width=True)
        
        # Travel willingness
        travel_counts = df_filtered['travelWillingness'].value_counts()
        fig_travel = px.bar(
            x=travel_counts.values,
            y=travel_counts.index,
            title="Travel Willingness",
            orientation='h',
            labels={'x': 'Number of Responses', 'y': 'Preference'}
        )
        fig_travel.update_traces(texttemplate='%{x}', textposition='outside')
        st.plotly_chart(fig_travel, use_container_width=True)
    
    with col2:
        # Career interests word cloud or top interests
        interests_data = []
        for interests in df_filtered['careerInterests']:
            if interests:
                interests_data.extend(interests.split(','))
        interests_counts = pd.Series(interests_data).value_counts()
        fig_interests = px.bar(
            x=interests_counts.values,
            y=interests_counts.index,
            title="Career Interests Distribution",
            orientation='h',
            labels={'x': 'Number of Responses', 'y': 'Interest Area'}
        )
        st.plotly_chart(fig_interests, use_container_width=True)

# Goals & Development tab
with tabs[5]:
    st.header("Goals & Development")
    col1, col2 = st.columns(2)
    
    with col1:
        # Mentorship preferences
        mentorship_counts = df_filtered['mentorshipType'].value_counts()
        fig_mentorship = px.bar(
            x=mentorship_counts.values,
            y=mentorship_counts.index,
            title="Preferred Mentorship Types",
            orientation='h',
            labels={'x': 'Number of Responses', 'y': 'Mentorship Type'}
        )
        fig_mentorship.update_traces(texttemplate='%{x}', textposition='outside')
        st.plotly_chart(fig_mentorship, use_container_width=True)
    
    with col2:
        # Career goals
        goals_data = []
        for goals in df_filtered['careerGoals']:
            if goals:
                goals_data.extend(goals.split(','))
        goals_counts = pd.Series(goals_data).value_counts().head(10)
        fig_goals = px.bar(
            x=goals_counts.values,
            y=goals_counts.index,
            title="Top Career Goals",
            orientation='h',
            labels={'x': 'Number of Responses', 'y': 'Goal'}
        )
        fig_goals.update_traces(texttemplate='%{x}', textposition='outside')
        st.plotly_chart(fig_goals, use_container_width=True)

# Analytics tab
with tabs[6]:
    st.header("Statistical Analysis")
    
    # Calculate basic statistics
    st.subheader("Response Patterns")
    col1, col2 = st.columns(2)
    
    with col1:
        # Calculate completion rate over time
        daily_completion = df_filtered.groupby(df_filtered['timestamp'].dt.date).size()
        completion_trend = px.line(
            x=daily_completion.index,
            y=daily_completion.values,
            title="Survey Completion Trend",
            labels={'x': 'Date', 'y': 'Number of Responses'}
        )
        st.plotly_chart(completion_trend, use_container_width=True)
    
    with col2:
        # Calculate average responses per day
        avg_responses = daily_completion.mean()
        median_responses = daily_completion.median()
        st.metric("Average Daily Responses", f"{avg_responses:.1f}")
        st.metric("Median Daily Responses", f"{median_responses:.1f}")
    
    # Analyze relationships between preferences
    st.subheader("Preference Analysis")
    col3, col4 = st.columns(2)
    
    with col3:
        # Analyze relationship between experience and career goals
        exp_goals = defaultdict(lambda: defaultdict(int))
        for _, row in df_filtered.iterrows():
            exp = row['constructionExperience']
            goals = row['careerGoals'].split(',') if row['careerGoals'] else []
            for goal in goals:
                exp_goals[exp][goal.strip()] += 1
        
        # Convert to DataFrame for visualization
        exp_goals_data = []
        for exp, goals in exp_goals.items():
            for goal, count in goals.items():
                exp_goals_data.append({
                    'Experience': exp,
                    'Goal': goal,
                    'Count': count
                })
        
        exp_goals_df = pd.DataFrame(exp_goals_data)
        if not exp_goals_df.empty:
            fig_exp_goals = px.bar(
                exp_goals_df,
                x='Experience',
                y='Count',
                color='Goal',
                title="Career Goals by Experience Level",
                labels={'Count': 'Number of Responses', 'Experience': 'Construction Experience'}
            )
            st.plotly_chart(fig_exp_goals, use_container_width=True)
    
    with col4:
        # Analyze certification levels vs environment preferences
        cert_env = pd.crosstab(
            df_filtered['certificationLevel'],
            df_filtered['environmentPreference']
        )
        
        fig_cert_env = px.imshow(
            cert_env,
            title="Certification Level vs Work Environment",
            labels=dict(x="Work Environment", y="Certification Level", color="Count"),
            color_continuous_scale="Viridis"
        )
        st.plotly_chart(fig_cert_env, use_container_width=True)
    
    # Insights section
    st.subheader("Key Insights")
    
    # Calculate some basic insights
    total_responses = len(df_filtered)
    top_cert_level = df_filtered['certificationLevel'].mode().iloc[0]
    top_env_pref = df_filtered['environmentPreference'].mode().iloc[0]
    
    # Display insights
    st.write("Based on the current data:")
    col5, col6 = st.columns(2)
    
    with col5:
        st.metric("Total Survey Responses", total_responses)
        st.metric("Most Common Certification Level", top_cert_level)
        st.metric("Most Preferred Work Environment", top_env_pref)
    
    with col6:
        # Calculate and display response completion time trends
        if 'timestamp' in df_filtered.columns:
            df_filtered['hour'] = df_filtered['timestamp'].dt.hour
            hourly_responses = df_filtered['hour'].value_counts().sort_index()
            
            fig_time = px.line(
                x=hourly_responses.index,
                y=hourly_responses.values,
                title="Response Distribution by Hour",
                labels={'x': 'Hour of Day', 'y': 'Number of Responses'}
            )
            st.plotly_chart(fig_time, use_container_width=True)

    # Add regression analysis section
    st.subheader("Regression Analysis")
    
    # Create numeric mappings for categorical variables
    def create_numeric_mapping(series):
        unique_values = series.unique()
        return {val: idx for idx, val in enumerate(unique_values)}
    
    # Create mappings for relevant columns
    exp_mapping = create_numeric_mapping(df_filtered['constructionExperience'])
    cert_mapping = create_numeric_mapping(df_filtered['certificationLevel'])
    
    # Convert categorical to numeric
    df_filtered['exp_numeric'] = df_filtered['constructionExperience'].map(exp_mapping)
    df_filtered['cert_numeric'] = df_filtered['certificationLevel'].map(cert_mapping)
    
    # Add regression selector
    col_reg1, col_reg2 = st.columns(2)
    
    with col_reg1:
        # Simple regression analysis
        st.write("Experience vs Certification Level")
        
        # Calculate regression
        x = df_filtered['exp_numeric']
        y = df_filtered['cert_numeric']
        
        if len(x) > 1:  # Need at least 2 points for regression
            # Calculate regression coefficients
            slope = (
                (x - x.mean()) * (y - y.mean())
            ).sum() / ((x - x.mean()) ** 2).sum()
            
            intercept = y.mean() - slope * x.mean()
            
            # Calculate R-squared
            y_pred = slope * x + intercept
            r_squared = 1 - ((y - y_pred) ** 2).sum() / ((y - y.mean()) ** 2).sum()
            
            # Create scatter plot with regression line
            fig_reg = go.Figure()
            
            # Add scatter plot
            fig_reg.add_trace(go.Scatter(
                x=x,
                y=y,
                mode='markers',
                name='Data Points',
                marker=dict(size=8)
            ))
            
            # Add regression line
            x_range = np.linspace(x.min(), x.max(), 100)
            y_range = slope * x_range + intercept
            
            fig_reg.add_trace(go.Scatter(
                x=x_range,
                y=y_range,
                mode='lines',
                name=f'Regression Line (R² = {r_squared:.2f})',
                line=dict(color='red')
            ))
            
            fig_reg.update_layout(
                title="Experience vs Certification Level",
                xaxis_title="Experience Level",
                yaxis_title="Certification Level",
                showlegend=True
            )
            
            st.plotly_chart(fig_reg, use_container_width=True)
            
            # Display regression statistics
            st.write(f"Regression Statistics:")
            st.write(f"• Slope: {slope:.3f}")
            st.write(f"• Intercept: {intercept:.3f}")
            st.write(f"• R-squared: {r_squared:.3f}")
            
            # Interpret the results
            st.write("#### Interpretation")
            if r_squared > 0.5:
                st.write("There is a strong relationship between experience and certification level.")
            elif r_squared > 0.3:
                st.write("There is a moderate relationship between experience and certification level.")
            else:
                st.write("There is a weak relationship between experience and certification level.")
            
            if slope > 0:
                st.write("As experience increases, certification level tends to increase.")
            else:
                st.write("As experience increases, certification level tends to decrease.")
    
    with col_reg2:
        # Time series regression
        st.write("Response Trend Analysis")
        
        # Group by date and count responses
        daily_counts = df_filtered.groupby(
            df_filtered['timestamp'].dt.date
        ).size().reset_index()
        daily_counts.columns = ['date', 'count']
        
        # Add numeric day column for regression
        daily_counts['day_num'] = range(len(daily_counts))
        
        if len(daily_counts) > 1:  # Need at least 2 points for regression
            # Calculate regression
            x = daily_counts['day_num']
            y = daily_counts['count']
            
            # Calculate regression coefficients
            slope = (
                (x - x.mean()) * (y - y.mean())
            ).sum() / ((x - x.mean()) ** 2).sum()
            
            intercept = y.mean() - slope * x.mean()
            
            # Calculate R-squared
            y_pred = slope * x + intercept
            r_squared = 1 - ((y - y_pred) ** 2).sum() / ((y - y.mean()) ** 2).sum()
            
            # Create plot
            fig_trend = go.Figure()
            
            # Add actual data points
            fig_trend.add_trace(go.Scatter(
                x=daily_counts['date'],
                y=daily_counts['count'],
                mode='markers',
                name='Daily Responses',
                marker=dict(size=8)
            ))
            
            # Add trend line
            fig_trend.add_trace(go.Scatter(
                x=daily_counts['date'],
                y=y_pred,
                mode='lines',
                name=f'Trend Line (R² = {r_squared:.2f})',
                line=dict(color='red')
            ))
            
            fig_trend.update_layout(
                title="Response Trend Over Time",
                xaxis_title="Date",
                yaxis_title="Number of Responses",
                showlegend=True
            )
            
            st.plotly_chart(fig_trend, use_container_width=True)
            
            # Display trend statistics
            st.write(f"Trend Statistics:")
            st.write(f"• Daily Change: {slope:.3f} responses/day")
            st.write(f"• R-squared: {r_squared:.3f}")
            
            # Interpret the trend
            st.write("#### Interpretation")
            if slope > 0:
                st.write(f"Response rate is increasing by approximately {slope:.1f} responses per day.")
            else:
                st.write(f"Response rate is decreasing by approximately {abs(slope):.1f} responses per day.")
            
            if r_squared > 0.5:
                st.write("The trend is very consistent over time.")
            elif r_squared > 0.3:
                st.write("The trend shows moderate consistency over time.")
            else:
                st.write("The trend is quite variable over time.")

# Add raw data table (collapsible)
with st.expander("View Raw Data"):
    st.dataframe(df_filtered)
