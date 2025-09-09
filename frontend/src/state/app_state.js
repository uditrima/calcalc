// Application state management
import { ApiClient } from '../data/api.js';

// Initialize API client
const api = new ApiClient('http://localhost:5000/api');

export const AppState = {
    // Initial state
    state: {
        foods: [
            { id: 1, name: 'Æble', calories: 52, protein: 0.3, carbohydrates: 14, fat: 0.2 },
            { id: 2, name: 'Banan', calories: 89, protein: 1.1, carbohydrates: 23, fat: 0.3 },
            { id: 3, name: 'Havregryn', calories: 389, protein: 16.9, carbohydrates: 66, fat: 6.9 }
        ],
        diary: { 
            date: new Date().toISOString().split('T')[0], 
            entries: [
                { id: 1, food_id: 1, food_name: 'Æble', calories: 52, protein: 0.3, carbohydrates: 14, fat: 0.2, meal_type: 'morgenmad' },
                { id: 2, food_id: 2, food_name: 'Banan', calories: 89, protein: 1.1, carbohydrates: 23, fat: 0.3, meal_type: 'snack' }
            ] 
        },
        exercises: [
            { id: 1, name: 'Løb', duration: 30, calories_burned: 300, exercise_type: 'cardio' },
            { id: 2, name: 'Vægtløftning', duration: 45, calories_burned: 200, exercise_type: 'styrke' }
        ],
        weights: [
            { id: 1, weight: 75.5, date: '2024-01-01' },
            { id: 2, weight: 75.2, date: '2024-01-02' },
            { id: 3, weight: 74.8, date: '2024-01-03' }
        ],
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
