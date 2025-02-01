# 🏗️ Construction Career Survey  

### **Overview**  
The **Construction Career Survey** web app enables **admin users** to enter and submit participant survey data, storing responses securely in **Firebase Firestore**. The app features **authentication via Firebase**, **frontend hosting on GitHub Pages**, and an **interactive Streamlit dashboard** to analyze career recommendations based on Holland Codes and MBTI results.

---

## 🚀 **Features**  
- **Secure Admin Login** – Only authorized admins can enter and submit data.  
- **Survey Data Submission** – Admins enter participant responses via an interactive form.  
- **Firestore Database** – Securely stores survey responses for later analysis.  
- **Streamlit Dashboard** – Provides real-time analytics and career recommendations.  
- **GitHub Pages Hosting** – Static frontend is hosted and accessible for admins.  

---

## 🛠️ **Tech Stack**  
| Component         | Technology Used |
|------------------|----------------|
| **Frontend**     | HTML, CSS, JavaScript |
| **Authentication** | Firebase Authentication |
| **Database**     | Firebase Firestore |
| **Hosting**      | GitHub Pages (Frontend) |
| **Dashboard**    | Streamlit (Python) |

---

## 📦 **Installation & Setup**  
### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/Embers-Staffing/construction-career-survey.git
cd construction-career-survey
```

### **2️⃣ Frontend Setup**
```sh
# No additional setup needed for frontend
# Static files are served directly via GitHub Pages
```

### **3️⃣ Analytics Dashboard Setup**
```sh
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt

# Set up Firebase credentials
# Place your firebase-credentials.json in the analytics directory
```

### **4️⃣ Environment Configuration**
1. Create `.env` file in the root directory
2. Add required environment variables:
```sh
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
```

### **5️⃣ Running the Dashboard**
```sh
cd analytics
streamlit run dashboard.py
```

---

## 🔒 **Security Notes**
- Never commit Firebase credentials or `.env` files
- Keep admin access credentials secure
- Regularly review authorized users in Firebase Console

---

## 📊 **Dashboard Features**
- Real-time survey response analytics
- Holland Code result visualization
- MBTI type distribution analysis
- Career recommendation insights
- Data export capabilities

---

## 🤝 **Contributing**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **License**
This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.
