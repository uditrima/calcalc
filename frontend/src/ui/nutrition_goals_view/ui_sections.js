// Nutrition Goals UI Sections
// Creates loading, error, and goals sections for the nutrition goals view

import { createGoalItem } from './goal_items.js';
import { createActionButtons } from './action_buttons.js';

export function createLoadingSection() {
    const section = document.createElement('div');
    section.className = 'loading-section';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    section.appendChild(spinner);
    
    const text = document.createElement('p');
    text.textContent = 'Indlæser mål...';
    section.appendChild(text);
    
    return section;
}

export function createErrorSection(error) {
    const section = document.createElement('div');
    section.className = 'error-section';
    
    const title = document.createElement('h3');
    title.textContent = 'Fejl ved indlæsning';
    section.appendChild(title);
    
    const message = document.createElement('p');
    message.textContent = error || 'Der opstod en fejl ved indlæsning af dine mål.';
    section.appendChild(message);
    
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Prøv igen';
    retryButton.className = 'retry-button';
    retryButton.addEventListener('click', () => {
        // This will be handled by the main component
        window.dispatchEvent(new CustomEvent('retryGoals'));
    });
    section.appendChild(retryButton);
    
    return section;
}

export function createGoalsSection(formattedGoals) {
    const section = document.createElement('div');
    section.className = 'goals-section';
    
    const title = document.createElement('h2');
    title.textContent = 'Dine Mål';
    section.appendChild(title);
    
    // Check if formattedGoals is null or undefined
    if (!formattedGoals) {
        console.warn('formattedGoals is null, using fallback values');
        // Use fallback values when goals are not loaded
        const fallbackGoals = {
            calories: { value: 1500, formatted: '1,500' },
            protein: { value: 133, formatted: '133g', percentage: '30%' },
            carbs: { value: 180, formatted: '180g', percentage: '45%' },
            fat: { value: 20, formatted: '20g', percentage: '25%' }
        };
        
        const caloriesGoal = createGoalItem('Kalorier', fallbackGoals.calories.formatted, '');
        section.appendChild(caloriesGoal);
        
        const carbsGoal = createGoalItem('Kulhydrater', fallbackGoals.carbs.formatted, fallbackGoals.carbs.percentage);
        section.appendChild(carbsGoal);
        
        const proteinGoal = createGoalItem('Protein', fallbackGoals.protein.formatted, fallbackGoals.protein.percentage);
        section.appendChild(proteinGoal);
        
        const fatGoal = createGoalItem('Fedt', fallbackGoals.fat.formatted, fallbackGoals.fat.percentage);
        section.appendChild(fatGoal);
    } else {
        // Calories goal
        const caloriesGoal = createGoalItem('Kalorier', formattedGoals.calories.formatted, '');
        section.appendChild(caloriesGoal);
        
        // Carbohydrates goal
        const carbsGoal = createGoalItem('Kulhydrater', formattedGoals.carbs.formatted, formattedGoals.carbs.percentage);
        section.appendChild(carbsGoal);
        
        // Protein goal
        const proteinGoal = createGoalItem('Protein', formattedGoals.protein.formatted, formattedGoals.protein.percentage);
        section.appendChild(proteinGoal);
        
        // Fat goal
        const fatGoal = createGoalItem('Fedt', formattedGoals.fat.formatted, formattedGoals.fat.percentage);
        section.appendChild(fatGoal);
    }
    
    // Add action buttons
    const actionButtons = createActionButtons();
    section.appendChild(actionButtons);
    
    return section;
}
