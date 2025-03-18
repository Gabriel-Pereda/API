class ApiService {
    constructor(baseUrl = '') {
        // Let's make this more flexible
        if (!baseUrl) {
            // No URL provided, use the current origin
            this.baseUrl = window.location.origin;
            console.log('Using current origin as API URL:', this.baseUrl);
        } else {
            // URL was explicitly provided
            this.baseUrl = baseUrl;
            console.log('Using provided API URL:', this.baseUrl);
        }
        
        this.token = localStorage.getItem('token');
        
        // Debug output
        if (this.token) {
            console.log('Token found in localStorage');
        } else {
            console.warn('No authentication token found');
        }
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
            ...options.headers
        };
    
        console.log(`Sending request to ${endpoint} with token: ${this.token ? 'Yes' : 'No'}`);
    
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });
    
            if (!response.ok) {
                console.error(`API Error: ${response.status} ${response.statusText}`);
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || error.error || response.statusText);
            }
    
            return response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    async getAllReservations() {
        return this.request('/reservations');
    }

    async getActiveReservations() {
        const reservations = await this.getAllReservations();
        const today = new Date();
        
        return reservations.filter(res => {
            const startDate = new Date(res.startDate);
            const endDate = new Date(res.endDate);
            return startDate <= today && endDate >= today;
        });
    }

    async createReservation(data) {
        return this.request('/reservations', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateReservation(id, data) {
        return this.request(`/reservations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteReservation(id) {
        return this.request(`/reservations/${id}`, {
            method: 'DELETE'
        });
    }

    async getCatwayReservations(catwayNumber) {
        return this.request(`/catways/${catwayNumber}/reservations`);
    }

    async getUsers() {
        return this.request('/users');
    }

    async getCatways() {
        return this.request('/catways');
    }

    async updateCatway(catwayNumber, data) {
        try {
            console.log('Updating catway:', { catwayNumber, data }); // Debug log
    
            const response = await fetch(`${this.baseUrl}/catways/${catwayNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    catwayState: data.catwayState
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData); // Debug log
                throw new Error(errorData.message || 'Failed to update catway');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Update catway error:', error);
            throw error;
        }
    }
    
    async getUser(email) {
        return this.request(`/users/${email}`);
    }

    async updateUser(email, data) {
        return this.request(`/users/${email}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteUser(email) {
        return this.request(`/users/${email}`, {
            method: 'DELETE'
        });
    }

    async deleteCatway(catwayNumber) {
        return this.request(`/catways/${catwayNumber}`, {
            method: 'DELETE'
        });
    }

    async deleteReservation(id) {
        return this.request(`/reservations/${id}`, {
            method: 'DELETE'
        });
    }

}

