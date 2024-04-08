const logoutButton = document.getElementById("logout")

logoutButton.addEventListener("click", e => {
    e.preventDefault()
    fetch('/api/sessions/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/login');
        }
    }
    )
})