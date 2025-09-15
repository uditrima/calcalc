// Nutrition Goals UI component
import { goalsState } from '../state/goals_state.js';

export function NutritionGoals(container) {
    if (!container) {
        throw new Error('NutritionGoals requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create nutrition goals structure
    const nutritionGoals = document.createElement('div');
    nutritionGoals.className = 'nutrition-goals';
    
    // Header
    const header = document.createElement('div');
    header.className = 'nutrition-goals-header';
    
    const backButton = document.createElement('button');
    backButton.className = 'go-back-btn';
    backButton.innerHTML = '←';
    backButton.addEventListener('click', () => {
        // Navigate back to edit-profile
        if (window.calorieTrackerApp) {
            window.calorieTrackerApp.showView('edit-profile');
        }
    });
    header.appendChild(backButton);
    
    const title = document.createElement('h1');
    title.textContent = 'Calorie & Macro Goals';
    header.appendChild(title);
    
    nutritionGoals.appendChild(header);
    
    // Content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'goals-content';
    nutritionGoals.appendChild(contentContainer);
    
    container.appendChild(nutritionGoals);
    
    // Subscribe to goals state changes
    const unsubscribe = goalsState.subscribe((goals, isLoading, error) => {
        updateGoalsDisplay(contentContainer, goals, isLoading, error);
    });
    
    // Load goals data
    goalsState.loadGoals();
    
    // Cleanup function
    nutritionGoals.cleanup = () => {
        unsubscribe();
    };
    
    return nutritionGoals;
}

function updateGoalsDisplay(container, goals, isLoading, error) {
    // Clear container
    container.innerHTML = '';
    
    if (isLoading) {
        const loadingSection = createLoadingSection();
        container.appendChild(loadingSection);
    } else if (error) {
        const errorSection = createErrorSection(error);
        container.appendChild(errorSection);
    } else if (goals) {
        const formattedGoals = goalsState.getFormattedGoals();
        const goalsSection = createGoalsSection(formattedGoals);
        container.appendChild(goalsSection);
    }
}

function createLoadingSection() {
    const section = document.createElement('div');
    section.className = 'loading-section';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    section.appendChild(spinner);
    
    const text = document.createElement('p');
    text.textContent = 'Indlæser mål...';
    text.className = 'loading-text';
    section.appendChild(text);
    
    return section;
}

function createErrorSection(message) {
    const section = document.createElement('div');
    section.className = 'error-section';
    
    const errorText = document.createElement('p');
    errorText.textContent = message;
    errorText.className = 'error-text';
    section.appendChild(errorText);
    
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Prøv igen';
    retryButton.className = 'retry-button';
    retryButton.addEventListener('click', () => {
        goalsState.loadGoals();
    });
    section.appendChild(retryButton);
    
    return section;
}

function createGoalsSection(formattedGoals) {
    const section = document.createElement('div');
    section.className = 'goals-section';
    
    const title = document.createElement('h2');
    title.textContent = 'Dine Mål';
    section.appendChild(title);
    
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
    
    return section;
}

function createGoalItem(label, amount, percentage) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'goal-label';
    labelEl.textContent = label;
    item.appendChild(labelEl);
    
    const valuesContainer = document.createElement('div');
    valuesContainer.className = 'goal-values';
    
    if (amount) {
        const amountEl = document.createElement('div');
        amountEl.className = 'goal-amount';
        amountEl.textContent = amount;
        amountEl.setAttribute('data-editable', 'true');
        amountEl.setAttribute('data-original-value', amount);
        valuesContainer.appendChild(amountEl);
    }
    
    if (percentage) {
        const percentageEl = document.createElement('div');
        percentageEl.className = 'goal-percentage';
        percentageEl.textContent = percentage;
        valuesContainer.appendChild(percentageEl);
    }
    
    item.appendChild(valuesContainer);
    
    // Make amount editable on click
    if (amount) {
        const amountEl = item.querySelector('.goal-amount');
        amountEl.style.cursor = 'pointer';
        amountEl.addEventListener('click', (e) => {
            e.stopPropagation();
            makeAmountEditable(amountEl, label);
        });
    }
    
    return item;
}

function makeAmountEditable(amountEl, label) {
    // Don't edit if already editing
    if (amountEl.querySelector('input')) return;
    
    const originalValue = amountEl.getAttribute('data-original-value');
    const currentValue = amountEl.textContent;
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.className = 'goal-amount-input';
    
    // Replace text with input
    amountEl.innerHTML = '';
    amountEl.appendChild(input);
    
    // Focus and select text
    input.focus();
    input.select();
    
    // Handle save on Enter or blur
    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue && newValue !== currentValue) {
            // Parse and validate the new value
            const numericValue = parseFloat(newValue.replace(/[^\d.]/g, ''));
            if (!isNaN(numericValue)) {
                // Format the value for display (preserve decimals)
                const formattedValue = numericValue % 1 === 0 ? 
                    numericValue.toString() : 
                    numericValue.toFixed(1);
                
                // Update the display
                amountEl.textContent = formattedValue;
                amountEl.setAttribute('data-original-value', formattedValue);
                
                // Update goals in state
                updateGoalValue(label, newValue);
            } else {
                // Restore original value if invalid
                amountEl.textContent = currentValue;
            }
        } else {
            // Restore original value
            amountEl.textContent = currentValue;
        }
        
        // Remove input and restore the formatted value
        const finalValue = amountEl.getAttribute('data-original-value') || currentValue;
        amountEl.innerHTML = finalValue;
    };
    
    // Handle cancel on Escape
    const cancelEdit = () => {
        amountEl.textContent = currentValue;
    };
    
    input.addEventListener('blur', saveValue);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveValue();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    });
}

function updateGoalValue(label, newValue) {
    // Get current goals from state
    const currentGoals = goalsState.getGoals();
    if (!currentGoals) return;
    
    // Parse the new value (remove 'g' suffix and convert to number)
    const numericValue = parseFloat(newValue.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) return;
    
    // Map Danish labels to English field names
    const fieldMap = {
        'Kalorier': 'daily_calories',
        'Kulhydrater': 'carbs_target', 
        'Protein': 'protein_target',
        'Fedt': 'fat_target'
    };
    
    const fieldName = fieldMap[label];
    if (!fieldName) return;
    
    // Update the goal value
    const updatedGoals = { ...currentGoals };
    updatedGoals[fieldName] = numericValue;
    
    // Update in state and save to backend
    goalsState.updateGoals(updatedGoals);
}
