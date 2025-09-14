// Application state management
import { ApiClient } from '../data/api.js';

// Initialize API client
const api = new ApiClient('http://localhost:5000/api');

export const AppState = {
    // Initial state
    state: {
        foods: [],
        diary: { 
            date: new Date().toISOString().split('T')[0], 
            entries: []
        },
        exercises: [],
        weights: [],
        goals: {
            daily_calories: 2000,
            protein_target: 150,
            carbs_target: 250,
            fat_target: 70
        }
    },
    
    // Event system
    observers: {},
    
    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.observers[key]) {
            this.observers[key] = [];
        }
        this.observers[key].push(callback);
    },
    
    // Unsubscribe from state changes
    unsubscribe(key, callback) {
        if (this.observers[key]) {
            const index = this.observers[key].indexOf(callback);
            if (index > -1) {
                this.observers[key].splice(index, 1);
            }
        }
    },
    
    // Notify all observers of a specific key
    notify(key) {
        if (this.observers[key]) {
            this.observers[key].forEach(callback => {
                try {
                    callback(this.state);
                } catch (error) {
                    console.error(`Error in observer for ${key}:`, error);
                }
            });
        }
    },
    
    // Notify all observers
    notifyAll() {
        Object.keys(this.observers).forEach(key => {
            this.notify(key);
        });
    },
    
    // State update methods
    setFoods(data) {
        this.state.foods = Array.isArray(data) ? data : [];
        this.notify('foods');
    },
    
    setDiary(data) {
        this.state.diary = {
            date: data.date || null,
            entries: Array.isArray(data.entries) ? data.entries : []
        };
        this.notify('diary');
    },
    
    setExercises(data) {
        this.state.exercises = Array.isArray(data) ? data : [];
        this.notify('exercises');
    },
    
    setWeights(data) {
        this.state.weights = Array.isArray(data) ? data : [];
        this.notify('weights');
    },
    
    setGoals(data) {
        this.state.goals = data || {};
        this.notify('goals');
    },
    
    // API integration methods
    async loadFoods() {
        try {
            const response = await api.getFoods();
            // API returns array directly, not wrapped in success/data object
            if (Array.isArray(response)) {
                this.setFoods(response);
            } else if (response.success) {
                this.setFoods(response.data);
            }
        } catch (error) {
            console.error('Failed to load foods:', error);
        }
    },
    
    async loadDiary(date) {
        try {
            const response = await api.getDiaryEntries(date);
            // Backend returns array directly for diary entries
            if (Array.isArray(response)) {
                this.setDiary({ date, entries: response });
            } else {
                console.error('Unexpected diary response format:', response);
                this.setDiary({ date, entries: [] });
            }
        } catch (error) {
            console.error('Failed to load diary:', error);
            this.setDiary({ date, entries: [] });
        }
    },
    
    async loadExercises(date) {
        try {
            const response = await api.getExercises(date);
            if (response.success) {
                this.setExercises(response.data);
            }
        } catch (error) {
            console.error('Failed to load exercises:', error);
        }
    },
    
    async loadWeights() {
        try {
            const response = await api.getWeights();
            if (response.success) {
                this.setWeights(response.data);
            }
        } catch (error) {
            console.error('Failed to load weights:', error);
        }
    },
    
    async loadGoals() {
        try {
            const response = await api.getGoals();
            if (response.success) {
                this.setGoals(response.data);
            }
        } catch (error) {
            console.error('Failed to load goals:', error);
        }
    },
    
    // Get current state
    getState() {
        return { ...this.state };
    },
    
    // Get specific state slice
    getFoods() {
        return [...this.state.foods];
    },
    
    getDiary() {
        return { ...this.state.diary };
    },
    
    getExercises() {
        return [...this.state.exercises];
    },
    
    getWeights() {
        return [...this.state.weights];
    },
    
    getGoals() {
        return { ...this.state.goals };
    }
};
