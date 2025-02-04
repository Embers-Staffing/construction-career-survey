'use strict';

import { firebaseConfig } from './config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

console.log('Firebase Config:', { 
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    const db = getFirestore(app);
    console.log('Firestore initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Test function to add a sample document
async function testFirebaseConnection() {
    try {
        console.log('Attempting to write test document...');
        // Try to add a test document to a simple collection
        const docRef = await addDoc(collection(db, 'test'), {
            timestamp: new Date().toISOString(),
            message: 'Test connection'
        });
        
        console.log('✅ Test successful! Document written with ID:', docRef.id);
        return true;
    } catch (error) {
        console.error('❌ Error testing Firebase connection:', error);
        console.error('Error details:', error.code, error.message);
        return false;
    }
}

// Run the test
console.log('Starting Firebase connection test...');
testFirebaseConnection();
