// Data loading and initialization
// Handles initial data loading and state management

import { AppState } from '../state/app_state.js';

export class DataLoader {
    constructor(app) {
        this.app = app;
    }
    
    async loadInitialData() {
        try {
            console.log('Loading initial data...');
            
            const today = new Date().toISOString().split('T')[0];
            console.log('Loading data for date:', today);
            
            // Load all data in parallel
            await Promise.all([
                AppState.loadFoods(),
                AppState.loadDiary(today),
                AppState.loadExercises(today),
                AppState.loadWeights(),
                AppState.loadGoals()
            ]);
            
            console.log('Initial data loaded successfully');
            console.log('Current state:', AppState.getState());
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
    
    async reloadData() {
        try {
            console.log('Reloading all data...');
            
            const state = AppState.getState();
            const currentDate = state.diary.date || new Date().toISOString().split('T')[0];
            
            // Reload all data in parallel
            await Promise.all([
                AppState.loadFoods(),
                AppState.loadDiary(currentDate),
                AppState.loadExercises(currentDate),
                AppState.loadWeights(),
                AppState.loadGoals()
            ]);
            
            console.log('Data reloaded successfully');
        } catch (error) {
            console.error('Failed to reload data:', error);
        }
    }
    
    async loadDataForDate(date) {
        try {
            console.log('Loading data for date:', date);
            
            // Load date-specific data
            await Promise.all([
                AppState.loadDiary(date),
                AppState.loadExercises(date)
            ]);
            
            console.log('Data loaded for date:', date);
        } catch (error) {
            console.error('Failed to load data for date:', error);
        }
    }
}
