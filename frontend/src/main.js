// Main application entry point
import { AppState } from './state/app_state.js';
import { Dashboard } from './ui/dashboard.js';

class CalorieTrackerApp {
    constructor() {
        this.state = new AppState();
        this.dashboard = new Dashboard();
        this.init();
    }
    
    init() {
        // TODO: Initialize application
        console.log('Kalorie Tracker App initialiseret');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CalorieTrackerApp();
});
