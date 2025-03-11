document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/html/dashboard.html';
        } else {
            alert(data.error ? 'Identifiants invalides' : 'Échec de la connexion');
        }
    } catch (error) {
        alert('Échec de la connexion');
        console.error('Erreur de connexion:', error);
    }
})