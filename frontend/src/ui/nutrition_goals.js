// Nutrition Goals UI component
import { goalsState } from '../state/goals_state.js';
import { createLoadingSection, createErrorSection, createGoalsSection } from './nutrition_goals_view.js';
import { commitChanges } from './nutrition_goals_controllers.js';

export function NutritionGoals(container) {
    // Clear container
    container.innerHTML = '';
    
    // Subscribe to goals state changes
    const unsubscribe = goalsState.subscribe((goals, isLoading, error) => {
        render(container, goals, isLoading, error);
    });
    
    // Load goals initially
    goalsState.loadGoals();
    
    // Add event listeners for custom events
    const handleRetry = () => goalsState.loadGoals();
    const handleReload = () => goalsState.loadGoals();
    const handleCommit = () => commitChanges();
    
    window.addEventListener('retryGoals', handleRetry);
    window.addEventListener('reloadGoals', handleReload);
    window.addEventListener('commitGoals', handleCommit);
    
    // Return cleanup function
    return () => {
        unsubscribe();
        window.removeEventListener('retryGoals', handleRetry);
        window.removeEventListener('reloadGoals', handleReload);
        window.removeEventListener('commitGoals', handleCommit);
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
        const formattedGoals = goalsState.getFormattedGoals();
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