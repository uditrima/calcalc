// Application state management
import { ApiClient } from '../data/api.js';
import { 
    formatGoalsForDisplay, 
    calculateMacrosFromCalories, 
    handleGoalsApiResponse, 
    handleGoalsApiError,
    DEFAULT_GOALS 
} from '../utils/goals_utils.js';

// Initialize API client
const api = new ApiClient();

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
        goals: { ...DEFAULT_GOALS }
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
        // Only update if data is valid, otherwise keep current goals
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            this.state.goals = data;
            this.notify('goals');
        } else if (data === null || data === undefined) {
            // If explicitly null/undefined, keep current goals (don't overwrite with empty object)
            console.warn('setGoals called with null/undefined, keeping current goals');
            // Still notify observers so they know goals loading failed
            this.notify('goals');
        } else {
            // Invalid data, keep current goals but still notify
            console.warn('setGoals called with invalid data, keeping current goals');
            this.notify('goals');
        }
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
            console.log('loadDiary API response:', response);
            
            // Backend returns array directly for diary entries
            if (Array.isArray(response)) {
                console.log('Setting diary entries:', response);
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
        // Prevent multiple simultaneous calls
        if (this._loadingGoals) {
            console.log('Goals already loading, skipping duplicate call');
            return;
        }
        
        this._loadingGoals = true;
        
        try {
            const response = await api.getGoals();
            handleGoalsApiResponse(response, (goals) => this.setGoals(goals), () => {});
        } catch (error) {
            handleGoalsApiError(error, (goals) => this.setGoals(goals), () => {});
        } finally {
            this._loadingGoals = false;
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
    },
    
    // Get formatted goals for display
    getFormattedGoals() {
        return formatGoalsForDisplay(this.state.goals);
    },
    
    // Calculate macros from calories
    calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat) {
        return calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat);
    }
};
