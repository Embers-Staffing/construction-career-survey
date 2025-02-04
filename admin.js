document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    console.log('Admin login page loaded');

    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    // Check if user is already logged in
    firebase.auth().onAuthStateChanged(async (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'No user');
        if (user) {
            // Verify admin status before redirecting
            try {
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                if (userDoc.exists && userDoc.data().role === 'admin') {
                    console.log('Admin verified, redirecting...');
                    document.location = 'admin-dashboard';
                } else {
                    console.log('User is not an admin, signing out...');
                    await firebase.auth().signOut();
                }
            } catch (error) {
                console.error('Error verifying admin status:', error);
                await firebase.auth().signOut();
            }
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!emailInput || !passwordInput) {
            console.error('Form inputs not found!');
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;
        
        console.log('Attempting login with email:', email);
        errorMessage.style.display = 'none';
        
        try {
            // First, try to sign in
            console.log('Calling signInWithEmailAndPassword...');
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
                .catch(error => {
                    console.error('Firebase auth error:', error);
                    throw error;
                });
            
            console.log('Sign in successful, user:', userCredential.user.uid);
            
            // Then check admin status
            console.log('Checking admin status...');
            const userDoc = await firebase.firestore().collection('users').doc(userCredential.user.uid).get()
                .catch(error => {
                    console.error('Firestore error:', error);
                    throw error;
                });
            
            console.log('User document:', userDoc.exists ? 'exists' : 'does not exist');
            
            if (userDoc.exists && userDoc.data().role === 'admin') {
                console.log('Admin status confirmed, redirecting...');
                document.location = 'admin-dashboard';
            } else {
                console.log('Not an admin, signing out...');
                await firebase.auth().signOut();
                throw new Error('Not authorized as admin');
            }
        } catch (error) {
            console.error('Login process error:', error);
            errorMessage.textContent = error.message || 'Invalid email or password';
            errorMessage.style.display = 'block';
            
            // Clear password field on error
            passwordInput.value = '';
        }
    });
});
