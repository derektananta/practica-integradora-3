const emailInput = document.getElementById('emailInput');
const restartPasswordBtn = document.getElementById('restartPasswordBtn');

restartPasswordBtn.addEventListener('click', async () => {
    const email = emailInput.value;

    if (!email) {
        alert("Please, write your email.");
        return;
    }

    try {
        const response = await fetch(`/api/sessions/checkUserByEmail?email=${email}`);
        const userData = await response.json();

        if (!userData || userData.status === 'error') {
            alert('User email is not register.');
            return;
        }

        const result = await fetch(`/api/sessions/restartMailPassword?email=${email}`, {
            method: 'GET',
        });

        if (result.status === 200) {
            alert('Email sent successfully.');
        } else {
            alert('An error ocurred sending email');
        }
    } catch (error) {
        alert('An error ocurred sending request.');
    }
});
