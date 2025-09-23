// Application state management
import { ApiClient } from '../data/api.js';
import { MACRO_CALORIES_PER_GRAM } from '../ui/nutrition_goals_constants.js';

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
        try {
            const response = await api.getGoals();
            if (response.success) {
                this.setGoals(response.data);
                console.log('Goals loaded:', response.data);
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
    },
    
    // Get formatted goals for display
    getFormattedGoals() {
        if (!this.state.goals || Object.keys(this.state.goals).length === 0) return null;

        // Keep original values as floats, only round for display formatting
        const calories = this.state.goals.daily_calories;
        const protein = this.state.goals.protein_target;
        const carbs = this.state.goals.carbs_target;
        const fat = this.state.goals.fat_target;

        // Calculate macro percentages using total calories
        const proteinCalories = protein * MACRO_CALORIES_PER_GRAM.protein;
        const carbsCalories = carbs * MACRO_CALORIES_PER_GRAM.carbs;
        const fatCalories = fat * MACRO_CALORIES_PER_GRAM.fat;

        const proteinPercentage = Math.round((proteinCalories / calories) * 100);
        const carbsPercentage = Math.round((carbsCalories / calories) * 100);
        const fatPercentage = Math.round((fatCalories / calories) * 100);

        return {
            calories: {
                value: calories,
                formatted: calories % 1 === 0 ? calories.toLocaleString() : calories.toFixed(1)
            },
            protein: {
                value: protein,
                formatted: protein % 1 === 0 ? `${protein}g` : `${protein.toFixed(1)}g`,
                percentage: `${proteinPercentage}%`
            },
            carbs: {
                value: carbs,
                formatted: carbs % 1 === 0 ? `${carbs}g` : `${carbs.toFixed(1)}g`,
                percentage: `${carbsPercentage}%`
            },
            fat: {
                value: fat,
                formatted: fat % 1 === 0 ? `${fat}g` : `${fat.toFixed(1)}g`,
                percentage: `${fatPercentage}%`
            }
        };
    },
    
    // Calculate macros from calories
    calculateMacrosFromCalories(calories, currentProtein, currentCarbs, currentFat) {
        
        // Calculate current macro calories
        const currentProteinCalories = currentProtein * MACRO_CALORIES_PER_GRAM.protein;
        const currentCarbsCalories = currentCarbs * MACRO_CALORIES_PER_GRAM.carbs;
        const currentFatCalories = currentFat * MACRO_CALORIES_PER_GRAM.fat;
        const totalCurrentMacroCalories = currentProteinCalories + currentCarbsCalories + currentFatCalories;

        // If no current macros, use default distribution
        if (totalCurrentMacroCalories === 0) {
            return {
                protein: calories * 0.25 / MACRO_CALORIES_PER_GRAM.protein, // 25% protein
                carbs: calories * 0.50 / MACRO_CALORIES_PER_GRAM.carbs,      // 50% carbs
                fat: calories * 0.25 / MACRO_CALORIES_PER_GRAM.fat           // 25% fat
            };
        }

        // Calculate new macros maintaining current proportions
        const proteinRatio = currentProteinCalories / totalCurrentMacroCalories;
        const carbsRatio = currentCarbsCalories / totalCurrentMacroCalories;
        const fatRatio = currentFatCalories / totalCurrentMacroCalories;

        return {
            protein: (calories * proteinRatio) / MACRO_CALORIES_PER_GRAM.protein,
            carbs: (calories * carbsRatio) / MACRO_CALORIES_PER_GRAM.carbs,
            fat: (calories * fatRatio) / MACRO_CALORIES_PER_GRAM.fat
        };
    }
};
