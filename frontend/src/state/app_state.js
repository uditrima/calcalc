// Application state management
export class AppState {
    constructor() {
        this.state = {
            // User data
            user: null,
            currentDate: new Date(),
            
            // Food data
            foods: [],
            selectedFood: null,
            
            // Diary data
            diaryEntries: [],
            dailyNutrition: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                sugar: 0,
                sodium: 0,
                potassium: 0,
                calcium: 0,
                iron: 0,
                vitamin_a: 0,
                vitamin_c: 0,
                vitamin_d: 0,
                vitamin_e: 0,
                vitamin_k: 0,
                thiamine: 0,
                riboflavin: 0,
                niacin: 0,
                folate: 0
            },
            
            // Exercise data
            exercises: [],
            dailyCaloriesBurned: 0,
            
            // Weight data
            weightHistory: [],
            currentWeight: null,
            
            // Goals data
            goals: null,
            goalProgress: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                weight: 0
            },
            
            // UI state
            activeView: 'dashboard',
            isLoading: false,
            error: null
        };
        
        this.listeners = new Map();
        this.init();
    }
    
    init() {
        // TODO: Initialize state management
    }
    
    // State management methods
    getState() {
        return this.state;
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }
    
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
    }
    
    unsubscribe(key, callback) {
        if (this.listeners.has(key)) {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    notifyListeners() {
        this.listeners.forEach(callbacks => {
            callbacks.forEach(callback => callback(this.state));
        });
    }
    
    // Action methods
    setActiveView(view) {
        this.setState({ activeView: view });
    }
    
    setCurrentDate(date) {
        this.setState({ currentDate: date });
    }
    
    addDiaryEntry(entry) {
        const diaryEntries = [...this.state.diaryEntries, entry];
        this.setState({ diaryEntries });
        this.calculateDailyNutrition();
    }
    
    removeDiaryEntry(entryId) {
        const diaryEntries = this.state.diaryEntries.filter(entry => entry.id !== entryId);
        this.setState({ diaryEntries });
        this.calculateDailyNutrition();
    }
    
    calculateDailyNutrition() {
        // TODO: Calculate daily nutrition from diary entries
    }
}
