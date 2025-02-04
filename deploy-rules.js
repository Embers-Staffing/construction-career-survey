// This script deploys the Firestore rules
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First, sign in as admin
        const userCredential = await firebase.auth().signInWithEmailAndPassword('kojinfox@gmail.com', 'Fg7SaWddQW!$');
        console.log('Signed in as:', userCredential.user.uid);

        // Get the rules
        const rulesResponse = await fetch('firestore.rules');
        const rulesText = await rulesResponse.text();
        console.log('Rules loaded:', rulesText);

        // Deploy rules using the Firebase Admin SDK
        const app = firebase.app();
        const projectId = app.options.projectId;
        
        const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/collectionGroups/:updateSecurityRules`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await userCredential.user.getIdToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rules: {
                    files: [{
                        content: rulesText,
                        name: 'firestore.rules'
                    }]
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Rules deployed successfully:', result);
        
    } catch (error) {
        console.error('Error deploying rules:', error);
    }
});
