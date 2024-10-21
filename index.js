document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('hairProfileForm');
    const profileDetails = document.getElementById('profileDetails');
    const recommendations = document.getElementById('recommendations');
    const benefitsDetails = document.getElementById('benefitsDetails');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent the form from submitting via the default method

        // Collect form data
        const formData = new FormData(form);
        const data = {
            hairType: formData.get('hairType'),
            hairConcerns: formData.getAll('hairConcerns'),
        };

        // Debugging: Console log the data being sent to the server
        console.log('Data sent to server:', data);

        // Display user profile
        profileDetails.innerHTML = `
            <strong>Hair Type:</strong> ${data.hairType} <br>
            <strong>Hair Concerns:</strong> ${data.hairConcerns.join(', ')}
        `;

        try {
            // Make POST request to backend API
            const response = await fetch('http://localhost:5000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            // Debugging: Console log the response from the server
            console.log('Response from server:', result);

            // Display recommendations and care tips
            if (result.message) {
                recommendations.innerHTML = `<p>${result.message}</p>`;
                benefitsDetails.innerHTML = '';
            } else {
                recommendations.innerHTML = result.map(item => `
                    <p><strong>Product:</strong> ${item.Recommended_Product}</p>
                `).join('');
                benefitsDetails.innerHTML = result.map(item => `
                    <p>${item.Care_Tip}</p>
                `).join('');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            recommendations.innerHTML = `<p>There was an error fetching recommendations. Please try again later.</p>`;
            benefitsDetails.innerHTML = '';
        }
    });
});
