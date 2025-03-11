document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/';
        return;
    }

    // Display user info
    document.getElementById('username').textContent = `Utilisateur: ${user.username}`;
    document.getElementById('email').textContent = `Email: ${user.email}`;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR');

    // Load current reservations
    loadCurrentReservations();

    // Add event listeners
    document.getElementById('logout').addEventListener('click', logout);
});

async function loadCurrentReservations() {
    try {
        const response = await fetch('/catways/reservations/current', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load reservations');
        }

        const reservations = await response.json();
        const tbody = document.querySelector('#reservationsTable tbody');

        if (reservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Aucune réservation en cours</td></tr>';
            return;
        }

        tbody.innerHTML = reservations.map(res => `
            <tr>
                <td>${res.numeroCatway}</td>
                <td>${res.nomClient}</td>
                <td>${res.nomBateau}</td>
                <td>${new Date(res.dateDebut).toLocaleDateString('fr-FR')}</td>
                <td>${new Date(res.dateFin).toLocaleDateString('fr-FR')}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading reservations:', error);
        const tbody = document.querySelector('#reservationsTable tbody');
        tbody.innerHTML = '<tr><td colspan="5">Erreur lors du chargement des réservations</td></tr>';
    }
}


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}