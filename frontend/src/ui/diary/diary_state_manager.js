// Diary State Manager component
import { AppState } from '../../state/app_state.js';
import { ApiClient } from '../../data/api.js';
import { updateMealSections } from './diary_state_updates.js';
import { updateSummarySection } from './diary_summary.js';

// Initialize API client
const api = new ApiClient();

/**
 * Sets up state management and event listeners
 * @param {HTMLElement} diary - The diary element
 * @returns {Object} Cleanup functions
 */
export function setupStateManager(diary) {
    // Subscribe to state changes for meal sections
    AppState.subscribe('diary', updateMealSections);
    AppState.subscribe('foods', updateMealSections);
    AppState.subscribe('goals', updateSummarySection);
    console.log('Diary: AppState subscriptions added');
    
    // Listen for goals committed event to refresh data
    const handleGoalsCommitted = async () => {
        console.log('Goals committed, refreshing diary data...');
        // Reload goals to ensure we have the latest data
        await AppState.loadGoals();
        // Force refresh diary data to sync with backend
        await forceRefreshDiary();
    };
    
    window.addEventListener('goalsCommitted', handleGoalsCommitted);
    
    // Force refresh diary data to sync with backend
    async function forceRefreshDiary() {
        console.log('Diary: forceRefreshDiary function defined');
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];
            await AppState.loadDiary(dateString);
        } catch (error) {
            console.error('Error force refreshing diary:', error);
        }
    }
    console.log('Diary: forceRefreshDiary function created successfully');
    
    // Expose force refresh function for external use
    diary.forceRefresh = forceRefreshDiary;
    console.log('Diary: forceRefresh assigned to diary');
    
    // Check for state mismatches and sync with backend
    async function checkAndSyncState() {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];
            
            // Get current frontend state
            const frontendState = AppState.getState();
            const frontendEntries = frontendState.diary.entries || [];
            
            // Get backend data directly
            const backendEntries = await api.getDiaryEntries(dateString);
            
            // Check if there are mismatches
            const frontendIds = new Set(frontendEntries.map(e => e.id));
            const backendIds = new Set(backendEntries.map(e => e.id));
            
            const hasMismatch = frontendIds.size !== backendIds.size || 
                               [...frontendIds].some(id => !backendIds.has(id));
            
            if (hasMismatch) {
                // Clear current state and reload from backend
                AppState.setDiary({ date: dateString, entries: [] });
                await AppState.loadDiary(dateString);
            }
        } catch (error) {
            console.error('Error checking state sync:', error);
        }
    }
    
    // Expose sync function
    diary.checkAndSyncState = checkAndSyncState;
    
    // Force complete UI cleanup and state sync
    console.log('Diary: About to define forceCompleteSync function');
    async function forceCompleteSync() {
        console.log('Diary: forceCompleteSync function defined');
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];
            
            // Clear all UI elements with data-entry-id
            const uiElements = document.querySelectorAll('[data-entry-id]');
            uiElements.forEach(element => {
                if (element._cleanupSwipe) {
                    element._cleanupSwipe();
                }
                element.remove();
            });
            
            // Clear state and reload from backend
            AppState.setDiary({ date: dateString, entries: [] });
            await AppState.loadDiary(dateString);
            
        } catch (error) {
            console.error('Error in force complete sync:', error);
        }
    }
    console.log('Diary: forceCompleteSync function created successfully');
    
    // Expose force complete sync function
    try {
        diary.forceCompleteSync = forceCompleteSync;
        console.log('Diary: forceCompleteSync assigned to diary');
    } catch (error) {
        console.error('Diary: Error assigning forceCompleteSync:', error);
    }
    
    return {
        cleanup: () => {
            AppState.unsubscribe('diary', updateMealSections);
            AppState.unsubscribe('foods', updateMealSections);
            AppState.unsubscribe('goals', updateSummarySection);
            window.removeEventListener('goalsCommitted', handleGoalsCommitted);
        }
    };
}
