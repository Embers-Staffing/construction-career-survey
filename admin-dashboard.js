document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard page loaded');
    const logoutBtn = document.getElementById('logoutBtn');
    const newSurveyBtn = document.getElementById('newSurveyBtn');
    const viewResponsesBtn = document.getElementById('viewResponsesBtn');
    const mainContent = document.getElementById('mainContent');
    const loadingSpinner = document.getElementById('loadingSpinner');
    let isVerifying = false;

    // Check authentication state
    firebase.auth().onAuthStateChanged(async (user) => {
        console.log('Dashboard auth state changed:', user ? 'User present' : 'No user');
        
        if (isVerifying) {
            console.log('Already verifying, skipping...');
            return;
        }
        
        if (!user) {
            console.log('No user, redirecting to login...');
            document.location = 'admin';
            return;
        }

        try {
            isVerifying = true;
            console.log('Verifying admin status...');
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            console.log('User document retrieved:', userDoc.exists ? 'exists' : 'does not exist');
            
            if (!userDoc.exists || userDoc.data().role !== 'admin') {
                console.log('Not an admin, signing out...');
                await firebase.auth().signOut();
                document.location = 'admin';
                return;
            }
            
            console.log('Admin verified, showing dashboard...');
            mainContent.style.display = 'block';
            loadingSpinner.style.display = 'none';
        } catch (error) {
            console.error('Error verifying admin status:', error);
            await firebase.auth().signOut();
            document.location = 'admin';
        } finally {
            isVerifying = false;
        }
    });

    // Logout handler
    logoutBtn.addEventListener('click', async () => {
        try {
            console.log('Logging out...');
            await firebase.auth().signOut();
            document.location = 'admin';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    // New Survey button handler
    newSurveyBtn.addEventListener('click', () => {
        document.location = 'index';
    });

    // View Responses button handler
    viewResponsesBtn.addEventListener('click', async () => {
        try {
            loadingSpinner.style.display = 'block';
            mainContent.innerHTML = '<h2>Survey Responses</h2>';
            
            const snapshot = await firebase.firestore().collection('survey_responses').get();
            
            if (snapshot.empty) {
                mainContent.innerHTML += '<p>No responses found.</p>';
            } else {
                const responsesHtml = ['<div class="table-responsive"><table class="table">',
                    '<thead><tr><th>Date</th><th>Name</th><th>Career Path</th><th>Actions</th></tr></thead>',
                    '<tbody>'];
                
                snapshot.forEach(doc => {
                    const data = doc.data();
                    responsesHtml.push(`
                        <tr>
                            <td>${new Date(data.timestamp?.toDate()).toLocaleDateString()}</td>
                            <td>${data.participant_info?.name || 'N/A'}</td>
                            <td>${data.recommendations?.join(', ') || 'N/A'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary view-response" data-id="${doc.id}">View</button>
                            </td>
                        </tr>
                    `);
                });
                
                responsesHtml.push('</tbody></table></div>');
                mainContent.innerHTML += responsesHtml.join('');
                
                // Add event listeners to view buttons
                document.querySelectorAll('.view-response').forEach(button => {
                    button.addEventListener('click', () => viewResponse(button.dataset.id));
                });
            }
        } catch (error) {
            console.error('Error loading responses:', error);
            mainContent.innerHTML += '<p class="text-danger">Error loading responses. Please try again.</p>';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    async function viewResponse(responseId) {
        try {
            loadingSpinner.style.display = 'block';
            const doc = await firebase.firestore().collection('survey_responses').doc(responseId).get();
            
            if (doc.exists) {
                const data = doc.data();
                mainContent.innerHTML = `
                    <h2>Survey Response Details</h2>
                    <div class="card">
                        <div class="card-body">
                            <h3>Participant Information</h3>
                            <p><strong>Name:</strong> ${data.participant_info?.name || 'N/A'}</p>
                            <p><strong>Date:</strong> ${new Date(data.timestamp?.toDate()).toLocaleString()}</p>
                            
                            <h3>Survey Results</h3>
                            <p><strong>Holland Code:</strong> ${data.survey_data?.holland_code || 'N/A'}</p>
                            <p><strong>MBTI Type:</strong> ${data.survey_data?.mbti_type || 'N/A'}</p>
                            
                            <h3>Recommendations</h3>
                            <ul>
                                ${(data.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <button class="btn btn-primary mt-3" onclick="document.location='admin-dashboard'">Back to List</button>
                `;
            } else {
                mainContent.innerHTML = '<p class="text-danger">Response not found.</p>';
            }
        } catch (error) {
            console.error('Error viewing response:', error);
            mainContent.innerHTML = '<p class="text-danger">Error loading response details. Please try again.</p>';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }
});
