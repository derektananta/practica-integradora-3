const form = document.getElementById('restartPasswordForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert('Please, fill all blank spaces.');
        return;
    }

    try {
        const response = await fetch(`/api/sessions/checkUserByEmail?email=${email}`);
        const userData = await response.json();

        if (!userData || userData.status === 'error') {
            alert('User email is not register.');
            return;
        }

        const result = await fetch('/api/sessions/restartPassword', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (result.status === 200) {
            alert('Password restarter successfully.');
            window.location.replace("/login")
        } else if (result.status === 400) {
            const errorData = await result.json();
            alert(`Error: ${errorData.error}`);
        } else {
            alert('An error ocurred restarting password.');
        }
    } catch (error) {
        alert('An error ocurred sending request.');
    }
});
