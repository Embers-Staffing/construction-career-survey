# Construction Career Survey

## Overview
A comprehensive web application for conducting construction career surveys and providing personalized career recommendations based on Holland Code and MBTI personality assessments.

## Features
- Interactive survey interface
- Real-time data collection with Firebase
- Personality-based career matching
- Analytics dashboard for survey insights
- Secure data handling and storage

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Firebase (Firestore)
- Analytics: Python, Streamlit
- Data Processing: Pandas, Plotly

## Prerequisites
- Node.js (v14 or higher)
- Python (3.8 or higher)
- Firebase account with Firestore enabled
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Embers-Staffing/construction-career-survey.git
cd construction-career-survey
```

### 2. Frontend Setup
Install the required Node.js dependencies:
```bash
npm install
```

### 3. Analytics Setup
Set up the Python virtual environment and install dependencies:
```bash
cd analytics
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Firebase Configuration

#### Web Application Setup
1. Create a new project in [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Go to Project Settings > General
4. Under "Your apps", create a new web app
5. Copy the Firebase configuration object
6. Create `.env` file in the root directory:
```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

#### Analytics Dashboard Setup
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the downloaded JSON file as `analytics/firebase-credentials.json`
4. Ensure this file is not committed to version control

## Running the Application

### Web Survey Interface
1. Start the development server:
```bash
npm start
```
2. Access the survey at `http://localhost:3000`

### Analytics Dashboard
1. Navigate to the analytics directory:
```bash
cd analytics
```

2. Activate the virtual environment:
```bash
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Start the Streamlit dashboard:
```bash
streamlit run dashboard.py
```

4. Access the dashboard at `http://localhost:1805`

## Development

### Project Structure
```
construction-career-survey/
├── index.html              # Main survey interface
├── assets/                 # Static assets
├── js/                    # JavaScript files
├── css/                   # Stylesheets
├── analytics/             # Analytics dashboard
│   ├── dashboard.py       # Main dashboard application
│   ├── config.py         # Firebase configuration
│   └── requirements.txt   # Python dependencies
└── README.md
```

### Adding Test Data
The repository includes a script to generate test data:
```bash
cd analytics
python add_dummy_data.py
```

## Security Considerations
- Never commit Firebase credentials to version control
- Keep the `.env` file secure and local
- Regularly rotate API keys and credentials
- Follow Firebase security rules best practices

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support or questions, please open an issue in the GitHub repository.
