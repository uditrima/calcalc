// Dashboard UI component - refactored to use modular architecture
import { AppState } from '../../state/app_state.js';
import { debounce } from '../../utils/debounce.js';
import { createCaloriesGauge } from './calories_gauge_svg.js';
import { updateCaloriesGauge } from './calories_gauge_updater.js';
import { createCustomScrollbar } from './custom_scrollbar.js';
import { createMacrosSection } from './stat_cards.js';
import { createExerciseSection, createWeightSection } from './other_components.js';
import { updateMacrosGauges, updateExerciseDisplay, updateWeightDisplay } from './update_handlers.js';

/**
 * Main Dashboard component - creates and manages the dashboard UI
 * @param {HTMLElement} container - The container element to render dashboard in
 * @returns {Function} Cleanup function to remove event listeners
 */
export function Dashboard(container) {
    console.log('Dashboard component called with container:', container);
    
    if (!container) {
        throw new Error('Dashboard requires a container element');
    }
    
    // Clear only dashboard content, preserve header
    const existingHeader = container.querySelector('.dashboard-header');
    container.innerHTML = '';
    if (existingHeader) {
        container.appendChild(existingHeader);
    }
    
    // Create dashboard structure
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';
    console.log('Dashboard element created:', dashboard);
    
    // Main calories gauge
    const caloriesSection = createCaloriesGauge();
    dashboard.appendChild(caloriesSection);
    
    // Macros section
    const macrosSection = createMacrosSection();
    dashboard.appendChild(macrosSection);
    
    // Exercise section
    const exerciseSection = createExerciseSection();
    dashboard.appendChild(exerciseSection);
    
    // Weight section
    const weightSection = createWeightSection();
    dashboard.appendChild(weightSection);
    
    // Add to container
    container.appendChild(dashboard);
    console.log('Dashboard added to container');
    
    // Create custom scrollbar for the dashboard container
    createCustomScrollbar(dashboard);
    
    // Dashboard uses AppState data only - no separate API calls
    console.log('Dashboard will use AppState data only');
    
    // Initial update - kald efter DOM elementer er tilføjet
    setTimeout(() => {
        updateDashboard();
        console.log('Dashboard initial update completed');
    }, 0);
    
    // Create debounced update function to prevent excessive updates
    const debouncedUpdate = debounce(updateDashboard, 100);
    
    // Listen for goals changes to update dashboard automatically
    const handleGoalsChange = () => {
        console.log('Goals changed, updating dashboard');
        debouncedUpdate();
    };
    
    // Listen for diary changes to update dashboard automatically
    const handleDiaryChange = () => {
        console.log('Diary changed, updating dashboard');
        debouncedUpdate();
    };
    
    // Listen for goals committed event to refresh data
    const handleGoalsCommitted = async () => {
        console.log('Goals committed, refreshing dashboard data...');
        // Reload goals to ensure we have the latest data
        await AppState.loadGoals();
        // Update dashboard with fresh data (no debounce for immediate update)
        updateDashboard();
    };
    
    // Listen for navigation to dashboard to refresh data
    const handleDashboardNavigation = () => {
        console.log('Navigated to dashboard, refreshing data...');
        // No debounce for navigation - immediate update
        updateDashboard();
    };
    
    // Subscribe to goals and diary changes in AppState
    AppState.subscribe('goals', handleGoalsChange);
    AppState.subscribe('diary', handleDiaryChange);
    
    // Handle sticky state changes from diary
    const handleStickyStateChange = (event) => {
        const { isSticky } = event.detail;
        const summarySection = document.querySelector('.summary-section');
        
        if (summarySection) {
            if (isSticky) {
                summarySection.classList.add('sticky-mode');
            } else {
                summarySection.classList.remove('sticky-mode');
            }
        }
    };
    
    // Add event listeners
    window.addEventListener('goalsCommitted', handleGoalsCommitted);
    window.addEventListener('dashboardNavigation', handleDashboardNavigation);
    window.addEventListener('onStickyStateChange', handleStickyStateChange);
    
    // Return cleanup function
    return () => {
        AppState.unsubscribe('goals', handleGoalsChange);
        AppState.unsubscribe('diary', handleDiaryChange);
        window.removeEventListener('goalsCommitted', handleGoalsCommitted);
        window.removeEventListener('dashboardNavigation', handleDashboardNavigation);
        window.removeEventListener('onStickyStateChange', handleStickyStateChange);
    };
    
    /**
     * Updates the entire dashboard with current AppState data
     */
    function updateDashboard() {
        // Dashboard uses AppState data directly - no separate API calls
        const state = AppState.getState();
        console.log('Dashboard updating with AppState data:', state);
        
        // Only update if we have valid data
        if (state && state.goals && state.diary) {
            updateCaloriesGauge(state);
            updateMacrosGauges(state);
            updateExerciseDisplay(state);
            updateWeightDisplay(state);
        } else {
            console.warn('Dashboard: Invalid state data, skipping update');
        }
    }
}
