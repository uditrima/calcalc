// Application state management
import { ApiClient } from '../data/api.js';

// Initialize API client
const api = new ApiClient('http://localhost:5000/api');

export const AppState = {
    // Initial state
    state: {
        foods: [],
        diary: { date: null, entries: [] },
        exercises: [],
        weights: [],
        goals: {}
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
            if (response.success) {
                this.setFoods(response.data);
            }
        } catch (error) {
            console.error('Failed to load foods:', error);
        }
    },
    
    async loadDiary(date) {
        try {
            const response = await api.getDiary(date);
            if (response.success) {
                this.setDiary({ date, entries: response.data });
            }
        } catch (error) {
            console.error('Failed to load diary:', error);
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
