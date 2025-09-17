// Nutrition Goals UI component
import { AppState } from '../state/app_state.js';
import { createLoadingSection, createErrorSection, createGoalsSection } from './nutrition_goals_view.js';
import { commitChanges } from './nutrition_goals_controllers.js';

export function NutritionGoals(container) {
    // Clear container
    container.innerHTML = '';
    
    // Create a mock goalsState object for compatibility
    const mockGoalsState = {
        isCommitButtonDimmed: () => true,
        setCommitButtonDimmed: (dimmed) => {
            // This will be handled by the commit button itself
        }
    };
    
    // Expose mock goalsState globally for access from other modules
    window.goalsState = mockGoalsState;
    
    // Subscribe to AppState goals changes
    const handleGoalsChange = () => {
        const goals = AppState.getGoals();
        render(container, goals, false, null);
    };
    
    AppState.subscribe('goals', handleGoalsChange);
    
    // Load goals initially
    AppState.loadGoals();
    
    // Add event listeners for custom events
    const handleRetry = () => AppState.loadGoals();
    const handleReload = () => AppState.loadGoals();
    const handleCommit = () => commitChanges();
    const handleActivateCommitButton = () => mockGoalsState.setCommitButtonDimmed(false);
    const handleDimCommitButton = () => mockGoalsState.setCommitButtonDimmed(true);
    
    window.addEventListener('retryGoals', handleRetry);
    window.addEventListener('reloadGoals', handleReload);
    window.addEventListener('commitGoals', handleCommit);
    window.addEventListener('activateCommitButton', handleActivateCommitButton);
    window.addEventListener('dimCommitButton', handleDimCommitButton);
    
    // Return cleanup function
    return () => {
        AppState.unsubscribe('goals', handleGoalsChange);
        window.removeEventListener('retryGoals', handleRetry);
        window.removeEventListener('reloadGoals', handleReload);
        window.removeEventListener('commitGoals', handleCommit);
        window.removeEventListener('activateCommitButton', handleActivateCommitButton);
        window.removeEventListener('dimCommitButton', handleDimCommitButton);
    };
}

function render(container, goals, isLoading, error) {
    // Clear container
    container.innerHTML = '';
    
    if (isLoading) {
        console.log('Showing loading section');
        const loadingSection = createLoadingSection();
        container.appendChild(loadingSection);
    } else if (error) {
        console.log('Showing error section:', error);
        const errorSection = createErrorSection(error);
        container.appendChild(errorSection);
    } else if (goals) {
        console.log('Showing goals section with goals:', goals);
        const formattedGoals = AppState.getFormattedGoals();
        console.log('Formatted goals:', formattedGoals);
        const goalsSection = createGoalsSection(formattedGoals);
        container.appendChild(goalsSection);
    } else {
        console.log('No goals data, showing fallback');
        // Show fallback with default values
        const fallbackGoals = {
            calories: { value: 1500, formatted: '1500' },
            protein: { value: 133, formatted: '133g', percentage: '30%' },
            carbs: { value: 180, formatted: '180g', percentage: '45%' },
            fat: { value: 20, formatted: '20g', percentage: '25%' }
        };
        const goalsSection = createGoalsSection(fallbackGoals);
        container.appendChild(goalsSection);
    }
}