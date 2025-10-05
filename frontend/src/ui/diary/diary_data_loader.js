// Diary Data Loader component
import { AppState } from '../../state/app_state.js';
import { updateSummarySection } from './diary_summary.js';
import { updateMealSectionsFromEntries, updateExerciseSection } from './diary_state_updates.js';

/**
 * Loads diary data for a specific date
 * @param {Date} date - The date to load data for
 */
export async function loadDiaryForDate(date) {
    try {
        const dateString = date.toISOString().split('T')[0];
        console.log('Loading diary data for date:', dateString);
        
        // Load diary entries for the selected date
        await AppState.loadDiary(dateString);
        console.log('Diary entries loaded');
        
        // Load exercises for the selected date
        await AppState.loadExercises(dateString);
        console.log('Exercises loaded');
        
        // Get updated state
        const state = AppState.getState();
        console.log('Updated state:', state);
        
        // Update the diary display with new data
        updateDiaryDisplay(dateString);
        console.log('Diary display updated');
        
    } catch (error) {
        console.error('Error loading diary data for date:', date, error);
    }
}

/**
 * Updates the diary display with current state data
 * @param {string} dateString - The date string
 */
function updateDiaryDisplay(dateString) {
    const state = AppState.getState();
    
    if (!state) {
        return;
    }
    
    // Update summary details with data for selected date
    updateSummarySection(state);
    
    // Update meal sections with diary entries for selected date
    updateMealSectionsFromEntries(state, dateString);
    
    // Update exercise section with exercises for selected date
    updateExerciseSection(state);
}
