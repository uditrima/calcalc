// Diary Swipe Handlers component
import { AppState } from '../../state/app_state.js';
import { ApiClient } from '../../data/api.js';

// Initialize API client
const api = new ApiClient();

/**
 * Deletes a food item from the diary
 * @param {HTMLElement} itemElement - The food item element to delete
 * @param {HTMLElement} container - The container element for event dispatching
 */
export async function deleteFoodItem(itemElement, container) {
    try {
        // Get entry ID from data attribute - this is the single source of truth
        const entryId = itemElement.getAttribute('data-entry-id');
        
        if (!entryId) {
            throw new Error('No data-entry-id found on food item');
        }
        
        // First, check if entry exists in current state
        const currentState = AppState.getState();
        const entryExists = currentState.diary.entries.some(entry => entry.id === parseInt(entryId));
        
        if (!entryExists) {
            // Entry doesn't exist in state, just remove from UI immediately
            if (itemElement._cleanupSwipe) {
                itemElement._cleanupSwipe();
            }
            itemElement.remove();
            return;
        }
        
        // Show loading state
        itemElement.style.opacity = '0.5';
        itemElement.style.pointerEvents = 'none';
        
        // Call delete API with the entry ID from data attribute
        const response = await api.deleteDiaryEntry(entryId);
        
        if (response && response.message) {
            // Get current date from AppState instead of creating new Date
            const currentState = AppState.getState();
            const currentDate = currentState.diary.date || new Date().toISOString().split('T')[0];
            
            // Update state immediately by removing the entry
            const updatedEntries = currentState.diary.entries.filter(entry => entry.id !== parseInt(entryId));
            AppState.setDiary({ date: currentDate, entries: updatedEntries });
            
            // Animation is already running, just wait for it to complete
            setTimeout(() => {
                // Cleanup swipe listeners
                if (itemElement._cleanupSwipe) {
                    itemElement._cleanupSwipe();
                }
                
                itemElement.remove();
            }, 100); // Short delay to ensure animation is complete
        } else {
            throw new Error(response?.error || 'Delete failed');
        }
    } catch (error) {
        console.error('Error deleting food item:', error);
        
        // If it's a 404 error, the entry might already be deleted
        if (error.message.includes('404')) {
            // Get current date from AppState instead of creating new Date
            const currentState = AppState.getState();
            const currentDate = currentState.diary.date || new Date().toISOString().split('T')[0];
            
            // Update state immediately by removing the entry
            const updatedEntries = currentState.diary.entries.filter(entry => entry.id !== parseInt(entryId));
            AppState.setDiary({ date: currentDate, entries: updatedEntries });
            
            // Animation is already running, just wait for it to complete
            setTimeout(() => {
                // Cleanup swipe listeners
                if (itemElement._cleanupSwipe) {
                    itemElement._cleanupSwipe();
                }
                
                itemElement.remove();
            }, 100); // Short delay to ensure animation is complete
            
            return;
        }
        
        // Reset item state for other errors
        itemElement.style.opacity = '1';
        itemElement.style.pointerEvents = 'auto';
        itemElement.style.transition = 'transform 0.3s ease';
        itemElement.style.transform = 'translateX(0)';
        
        alert(`Fejl ved sletning: ${error.message}`);
    }
}
