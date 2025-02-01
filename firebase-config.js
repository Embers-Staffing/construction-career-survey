// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJL16XmFwU7BAk9ypZuWtz0oPmkA62HvI",
    authDomain: "construction-career-survey.firebaseapp.com",
    projectId: "construction-career-survey",
    storageBucket: "construction-career-survey.firebasestorage.app",
    messagingSenderId: "505628721728",
    appId: "1:505628721728:web:8b539a03956290b1c155a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
