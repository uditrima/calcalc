// Main application entry point
import { AppState } from './state/app_state.js';
import { CalorieTrackerApp } from './core/app_orchestrator.js';

// Make AppState globally available for debugging
window.AppState = AppState;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calorieTrackerApp = new CalorieTrackerApp();
});