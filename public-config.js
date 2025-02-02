// Firebase configuration for public use
const firebaseConfig = {
    apiKey: "AIzaSyBJL16XmFwU7BAk9ypZuWtz0oPmkA62HvI",
    authDomain: "construction-career-survey.firebaseapp.com",
    projectId: "construction-career-survey",
    storageBucket: "construction-career-survey.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890",
    measurementId: "G-ABCDEF1234"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
