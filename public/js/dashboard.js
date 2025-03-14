const api = new ApiService();

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupEventListeners();
});

async function initializeDashboard() {
    try {
        updateDashboardInfo();
        showSection('overview');
        await loadSectionData('overview');
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        if (error.message.includes('401')) {
            window.location.href = '/';
        }
    }
}

function updateDashboardInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    document.querySelector('.user-info').innerHTML = `
        <p>Utilisateur: ${user.email}</p>
    `;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('fr-FR', options);
    document.querySelector('.current-date').textContent = today;
}

async function loadSectionData(sectionId) {
    try {
        console.log(`📡 Loading section: ${sectionId}`);
        showLoading(sectionId);

        // Validate section exists
        const section = document.getElementById(sectionId);
        if (!section) {
            throw new Error(`Section ${sectionId} not found`);
        }

        switch(sectionId) {
            case 'overview':
                try {
                    const reservations = await api.getAllReservations();
                    const activeReservations = reservations.filter(res => {
                        const now = new Date();
                        const startDate = new Date(res.startDate);
                        const endDate = new Date(res.endDate);
                        return startDate <= now && endDate >= now;
                    });
                    console.log(`📅 Found ${activeReservations.length} active reservations`);
                    renderActiveReservations(activeReservations);
                } catch (error) {
                    console.error('Failed to load active reservations:', error);
                    showError('Unable to load active reservations');
                }
                break;

            case 'catways':
                try {
                    const catways = await api.getCatways();
                    console.log(`🚢 Found ${catways.length} catways`);
                    renderCatways(catways);
                } catch (error) {
                    console.error('Failed to load catways:', error);
                    showError('Unable to load catways');
                }
                break;

            case 'reservations':
                try {
                    const reservations = await api.getAllReservations();
                    console.log(`📋 Found ${reservations.length} reservations`);
                    renderReservations(reservations);
                } catch (error) {
                    console.error('Failed to load reservations:', error);
                    showError('Unable to load reservations');
                }
                break;

            case 'users':
                try {
                    const users = await api.getUsers();
                    console.log(`👥 Found ${users.length} users`);
                    renderUsers(users);
                } catch (error) {
                    console.error('Failed to load users:', error);
                    showError('Unable to load users');
                }
                break;

            default:
                console.warn(`⚠️ Unknown section: ${sectionId}`);
                showError(`Unknown section: ${sectionId}`);
                break;
        }
    } catch (error) {
        console.error(`❌ Error in loadSectionData:`, error);
        showError(error.message);
    } finally {
        hideLoading(sectionId);
    }
}

function renderActiveReservations(reservations) {
    const tbody = document.querySelector('#activeReservationsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = reservations.map(res => `
        <tr>
            <td>${res.catwayNumber}</td>
            <td>${res.clientName}</td>
            <td>${res.boatName}</td>
            <td>${new Date(res.startDate).toLocaleDateString('fr-FR')}</td>
            <td>${new Date(res.endDate).toLocaleDateString('fr-FR')}</td>
        </tr>
    `).join('');
}

function renderCatways(catways) {
    const tbody = document.querySelector('#catwaysTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = catways.map(catway => `
        <tr>
            <td>${catway.catwayNumber}</td>
            <td>${catway.catwayType}</td>
            <td>${catway.catwayState}</td>
            <td>
                <button class="edit-btn" onclick="openModal(${JSON.stringify(catway).replace(/"/g, '&quot;')})">
                    Modifier
                </button>
                <button class="delete-btn" onclick="deleteCatway(${catway.catwayNumber})">
                    Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

function renderReservations(reservations) {
    const tbody = document.querySelector('#reservationsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = reservations.map(res => `
        <tr>
            <td>${res.catwayNumber}</td>
            <td>${res.clientName}</td>
            <td>${res.boatName}</td>
            <td>${new Date(res.startDate).toLocaleDateString('fr-FR')}</td>
            <td>${new Date(res.endDate).toLocaleDateString('fr-FR')}</td>
            <td>
                <button class="edit-btn" onclick="openModal(${JSON.stringify(res).replace(/"/g, '&quot;')})">
                    Modifier
                </button>
                <button class="delete-btn" onclick="deleteReservation('${res._id}')">
                    Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

function renderUsers(users) {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.email}</td>
            <td>${user.role || 'User'}</td>
            <td>
                <button class="edit-btn" onclick="editUser('${user.email}')">
                    Modifier
                </button>
                <button class="delete-btn" onclick="deleteUser('${user.email}')">
                    Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

function editUser(email) {
    api.getUser(email)
        .then(user => {
            openModal(user);
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            showError('Failed to load user data');
        });
}

async function deleteCatway(catwayNumber) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce catway ?')) return;

    try {
        await api.deleteCatway(catwayNumber);
        await loadSectionData('catways');
        showSuccess('Catway supprimé avec succès');
    } catch (error) {
        console.error('Delete catway error:', error);
        showError('Échec de la suppression du catway');
    }
}

async function deleteReservation(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
        await api.deleteReservation(id);
        await loadSectionData('reservations');
        showSuccess('Réservation supprimée avec succès');
    } catch (error) {
        console.error('Delete reservation error:', error);
        showError('Échec de la suppression de la réservation');
    }
}

async function deleteUser(email) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
        await api.deleteUser(email);
        await loadSectionData('users');
        showSuccess('Utilisateur supprimé avec succès');
    } catch (error) {
        console.error('Delete user error:', error);
        showError('Échec de la suppression de l\'utilisateur');
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Modal events
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Create buttons
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            openCreateModal(e.target.dataset.type);
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close') || 
            e.target.classList.contains('btn-secondary')) {
            closeModal();
        }
    });

    // Logout
    document.getElementById('logout').addEventListener('click', logout);

    // Modal form submission
    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
    document.getElementById('editForm')?.addEventListener('submit', handleEditSubmit);
    document.getElementById('createForm').addEventListener('submit', handleCreateSubmit);
    
}

function handleNavigation(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    // Handle external links (like API docs)
    if (href === '/api-docs') {
        window.open(href, '_blank');
        return;
    }

    // Handle internal navigation
    const sectionId = href.substring(1);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
    
    showSection(sectionId);
    loadSectionData(sectionId);
}

function showSection(sectionId) {
    // Skip section display logic for external links
    if (sectionId === 'api-docs') return;
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

// Modal handling
let currentItem = null;

function openModal(item) {
    console.log('Opening modal with item:', item);
    const modal = document.getElementById('editModal');
    if (!modal) {
        console.error('Edit modal not found');
        return;
    }

    // Parse item if it's a string
    try {
        if (typeof item === 'string') {
            item = JSON.parse(item);
        }
    } catch (error) {
        console.error('Error parsing item:', error);
        return;
    }

    currentItem = item;
    fillModalForm(item);
    modal.style.display = 'block';
}

function openCreateModal(type) {
    const modal = document.getElementById('createModal');
    setupCreateForm(type);
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('createModal').style.display = 'none';
    currentItem = null;
}

async function handleEditSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    try {
        showLoading();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form data:', data); // Debug log
        
        if (currentItem.catwayNumber && !currentItem.clientName) {
            // Validate state
            if (!data.catwayState?.trim()) {
                throw new Error('L\'état du catway ne peut pas être vide');
            }

            // Update catway
            await api.updateCatway(currentItem.catwayNumber, {
                catwayState: data.catwayState.trim()
            });
            
            closeModal();
            await loadSectionData('catways');
            showSuccess('Catway mis à jour avec succès');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showError(error.message || 'Échec de la mise à jour du catway');
    } finally {
        hideLoading();
    }
}

function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.id = 'globalLoader';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.remove();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
    
    document.body.appendChild(errorDiv);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
    
    document.body.appendChild(successDiv);
}

function fillModalForm(item) {
    console.log('Filling form with item:', item);
    const form = document.getElementById('editForm');
    if (!form) return;

    // Clear previous form content
    form.innerHTML = '';

    if (item.catwayNumber && !item.clientName) {
        // Catway form (only state is editable)
        form.innerHTML = `
            <h2>Modifier le Catway</h2>
            <div class="form-group">
                <label>Numéro:</label>
                <input type="number" name="catwayNumber" value="${item.catwayNumber}" readonly>
            </div>
            <div class="form-group">
                <label>Type:</label>
                <select name="catwayType" disabled>
                    <option value="short" ${item.catwayType === 'short' ? 'selected' : ''}>Court</option>
                    <option value="long" ${item.catwayType === 'long' ? 'selected' : ''}>Long</option>
                </select>
            </div>
            <div class="form-group">
                <label>État:</label>
                <input type="text" name="catwayState" value="${item.catwayState}" required>
            </div>
        `;
    } else if (item._id) {
        // Reservation form (all fields are editable except catway number)
        form.innerHTML = `
            <h2>Modifier la Réservation</h2>
            <div class="form-group">
                <label>Numéro de Catway:</label>
                <input type="number" name="catwayNumber" value="${item.catwayNumber}" readonly>
            </div>
            <div class="form-group">
                <label>Nom du Client:</label>
                <input type="text" name="clientName" value="${item.clientName}" required>
            </div>
            <div class="form-group">
                <label>Nom du Bateau:</label>
                <input type="text" name="boatName" value="${item.boatName}" required>
            </div>
            <div class="form-group">
                <label>Date de Début:</label>
                <input type="date" name="startDate" value="${item.startDate.split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label>Date de Fin:</label>
                <input type="date" name="endDate" value="${item.endDate.split('T')[0]}" required>
            </div>
        `;
    } else if (item.email) {
        // User form (email and role are editable)
        form.innerHTML = `
            <h2>Modifier l'Utilisateur</h2>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" value="${item.email}" required>
            </div>
            <div class="form-group">
                <label>Rôle:</label>
                <select name="role">
                    <option value="user" ${item.role === 'user' ? 'selected' : ''}>Utilisateur</option>
                    <option value="admin" ${item.role === 'admin' ? 'selected' : ''}>Administrateur</option>
                </select>
            </div>
        `;
    }

    // Add submit and cancel buttons for all forms
    form.innerHTML += `
        <div class="form-actions">
            <button type="submit" class="btn-primary">Mettre à jour</button>
            <button type="button" class="btn-secondary close">Annuler</button>
        </div>
    `;
}

async function handleCreateSubmit(e) {
    e.preventDefault();
    try {
        const type = e.target.dataset.type;
        const formData = getFormData('createForm');
        
        switch(type) {
            case 'catway':
                await api.createCatway(formData);
                break;
            case 'reservation':
                await api.createReservation(formData);
                break;
            case 'user':
                await api.createUser(formData);
                break;
        }
        
        closeModal();
        await loadSectionData(getCurrentSection());
        showSuccess('Item created successfully');
    } catch (error) {
        showError('Failed to create item');
    }
}

// Utility functions
function showLoading(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('loading');
}

function hideLoading(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.classList.remove('loading');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.insertBefore(successDiv, document.body.firstChild);
    setTimeout(() => successDiv.remove(), 3000);
}

function getCurrentSection() {
    return document.querySelector('.nav-link.active').getAttribute('href').substring(1);
}

function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});