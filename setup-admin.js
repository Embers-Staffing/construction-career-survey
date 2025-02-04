// This script sets up the admin user in Firestore
document.addEventListener('DOMContentLoaded', async () => {
    const statusDiv = document.getElementById('status');
    
    function updateStatus(message, isError = false) {
        console.log(message);
        statusDiv.innerHTML += `<p class="${isError ? 'text-danger' : ''}">${message}</p>`;
    }

    try {
        updateStatus('Starting admin setup...');
        
        // Sign in first
        updateStatus('Signing in...');
        const userCredential = await firebase.auth().signInWithEmailAndPassword('kojinfox@gmail.com', 'Fg7SaWddQW!$');
        const user = userCredential.user;
        updateStatus(`Signed in as: ${user.uid}`);

        // Check if user document already exists
        updateStatus('Checking if admin document exists...');
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const data = userDoc.data();
            if (data.role === 'admin') {
                updateStatus('Admin user already exists and has admin role.');
            } else {
                updateStatus('User exists but is not an admin. Attempting to update role...', true);
                try {
                    await userRef.update({ role: 'admin' });
                    updateStatus('Successfully updated user to admin role.');
                } catch (updateError) {
                    updateStatus(`Error updating role: ${updateError.message}`, true);
                }
            }
        } else {
            updateStatus('Admin document does not exist. Attempting to create...');
            try {
                await userRef.set({
                    email: 'kojinfox@gmail.com',
                    role: 'admin',
                    created: firebase.firestore.FieldValue.serverTimestamp()
                });
                updateStatus('Admin user document created successfully!');
            } catch (createError) {
                updateStatus(`Error creating admin: ${createError.message}`, true);
                updateStatus('Please go to the Firebase Console and add these security rules:', true);
                updateStatus(`
<pre>
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
</pre>
                `, true);
            }
        }
        
        // Verify the document
        const verifyDoc = await userRef.get();
        if (verifyDoc.exists) {
            updateStatus('Final verification - Admin document exists:');
            updateStatus(JSON.stringify(verifyDoc.data(), null, 2));
        }
        
    } catch (error) {
        updateStatus(`Error in setup: ${error.message}`, true);
        if (error.code === 'permission-denied') {
            updateStatus('Please go to the Firebase Console and add these security rules:', true);
            updateStatus(`
<pre>
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
</pre>
            `, true);
        }
    }
});
