// API client for backend communication
export class ApiClient {
    constructor(baseUrl = 'http://localhost:5000/api') {
        this.baseUrl =
            baseUrl ||
            (window.location.hostname === "localhost"
                ? "http://localhost:5000/api"
                : "https://calcalc.onrender.com/api");
    }
    
    // Helper method for making HTTP requests
    async _request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }
    
    // Food API methods
    async getFoods() {
        return await this._request('/foods/');
    }
    
    async getFoodById(id) {
        return await this._request(`/foods/${id}/`);
    }
    
    async createFood(data) {
        return await this._request('/foods/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async updateFood(id, data) {
        return await this._request(`/foods/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async deleteFood(id) {
        return await this._request(`/foods/${id}/`, {
            method: 'DELETE'
        });
    }
    
    // Diary API methods
    async getDiaryEntries(date) {
        return await this._request(`/diary/entries?date=${date}`);
    }
    
    async getDiarySummary(date) {
        return await this._request(`/diary/summary?date=${date}`);
    }
    
    async addDiaryEntry(data) {
        return await this._request('/diary/entries', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async updateDiaryEntry(id, data) {
        return await this._request(`/diary/entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async deleteDiaryEntry(id) {
        return await this._request(`/diary/entries/${id}`, {
            method: 'DELETE'
        });
    }
    
    // Exercise API methods
    async getExercises(date) {
        return await this._request(`/exercises/${date}/`);
    }
    
    async addExercise(data) {
        return await this._request('/exercises/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async updateExercise(id, data) {
        return await this._request(`/exercises/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async deleteExercise(id) {
        return await this._request(`/exercises/${id}/`, {
            method: 'DELETE'
        });
    }
    
    // Weight API methods
    async getWeights() {
        return await this._request('/weights/');
    }
    
    async addWeight(data) {
        return await this._request('/weights/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async updateWeight(id, data) {
        return await this._request(`/weights/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async deleteWeight(id) {
        return await this._request(`/weights/${id}/`, {
            method: 'DELETE'
        });
    }
    
    // Goals API methods
    async getGoals() {
        return await this._request('/goals/');
    }
    
    async setGoals(data) {
        return await this._request('/goals/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async updateGoals(id, data) {
        return await this._request(`/goals/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
}
