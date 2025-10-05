// Diary Summary component
import { AppState } from '../../state/app_state.js';

/**
 * Creates the summary section with calorie calculations
 * @returns {HTMLElement} The summary section element
 */
export function createSummarySection() {
    const summarySection = document.createElement('div');
    summarySection.className = 'summary-section';
    
    const summaryHeader = document.createElement('div');
    summaryHeader.className = 'summary-header';
    
    const summaryTitle = document.createElement('h3');
    summaryTitle.textContent = 'Resterende kalorier';
    summaryHeader.appendChild(summaryTitle);
    
    const moreMenuButton = document.createElement('button');
    moreMenuButton.className = 'more-menu-btn';
    moreMenuButton.innerHTML = '⋮';
    moreMenuButton.title = 'Mere menu';
    summaryHeader.appendChild(moreMenuButton);
    
    summarySection.appendChild(summaryHeader);
    
    const summaryDetails = document.createElement('div');
    summaryDetails.className = 'summary-details';
    
    // Base mål
    const goalItem = document.createElement('div');
    goalItem.className = 'summary-item';
    const goalCalories = document.createElement('div');
    goalCalories.className = 'summary-number goal-calories';
    // Get goals data or use default
    const formattedGoals = AppState.getFormattedGoals();
    goalCalories.textContent = formattedGoals?.calories.formatted || '1,500';
    const goalLabel = document.createElement('div');
    goalLabel.className = 'summary-label';
    goalLabel.textContent = 'Base mål';
    goalItem.appendChild(goalCalories);
    goalItem.appendChild(goalLabel);
    summaryDetails.appendChild(goalItem);
    
    const minusOperator = document.createElement('div');
    minusOperator.className = 'operator';
    minusOperator.textContent = '-';
    summaryDetails.appendChild(minusOperator);
    
    // Mad
    const foodItem = document.createElement('div');
    foodItem.className = 'summary-item';
    const foodCalories = document.createElement('div');
    foodCalories.className = 'summary-number diary-food-total-calories';
    foodCalories.textContent = '0';
    const foodLabel = document.createElement('div');
    foodLabel.className = 'summary-label';
    foodLabel.textContent = 'Mad';
    foodItem.appendChild(foodCalories);
    foodItem.appendChild(foodLabel);
    summaryDetails.appendChild(foodItem);
    
    const plusOperator = document.createElement('div');
    plusOperator.className = 'operator';
    plusOperator.textContent = '+';
    summaryDetails.appendChild(plusOperator);
    
    // Motion
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'summary-item';
    const exerciseCalories = document.createElement('div');
    exerciseCalories.className = 'summary-number exercise-calories';
    exerciseCalories.textContent = '0';
    const exerciseLabel = document.createElement('div');
    exerciseLabel.className = 'summary-label';
    exerciseLabel.textContent = 'Motion';
    exerciseItem.appendChild(exerciseCalories);
    exerciseItem.appendChild(exerciseLabel);
    summaryDetails.appendChild(exerciseItem);
    
    const equalsOperator = document.createElement('div');
    equalsOperator.className = 'operator';
    equalsOperator.textContent = '=';
    summaryDetails.appendChild(equalsOperator);
    
    // Resterende kalorier
    const remainingItem = document.createElement('div');
    remainingItem.className = 'summary-item';
    const remainingCalories = document.createElement('div');
    remainingCalories.className = 'summary-number remaining-calories';
    // Get goals data or use default
    const formattedGoalsRemaining = AppState.getFormattedGoals();
    remainingCalories.textContent = formattedGoalsRemaining?.calories.formatted || '1,500';
    const remainingLabel = document.createElement('div');
    remainingLabel.className = 'summary-label';
    remainingLabel.textContent = 'Resterende kalorier';
    remainingItem.appendChild(remainingCalories);
    remainingItem.appendChild(remainingLabel);
    summaryDetails.appendChild(remainingItem);
    
    summarySection.appendChild(summaryDetails);
    
    return summarySection;
}

/**
 * Updates the summary section with current state data
 * @param {Object} state - The current app state
 */
export function updateSummarySection(state) {
    const entries = state.diary.entries || [];
    const exercises = state.exercises || [];
    const goals = state.goals || {};
    
    const totalFoodCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const totalExerciseCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
    const goalCalories = goals.daily_calories || 2000;
    const remainingCalories = goalCalories - totalFoodCalories + totalExerciseCalories;
    
    // Update summary display
    const goalElement = document.querySelector('.goal-calories');
    const foodElement = document.querySelector('.diary-food-total-calories');
    const exerciseElement = document.querySelector('.exercise-calories');
    const remainingElement = document.querySelector('.remaining-calories');
    
    if (goalElement) goalElement.textContent = goalCalories.toLocaleString();
    if (foodElement) foodElement.textContent = Math.round(totalFoodCalories);
    if (exerciseElement) exerciseElement.textContent = Math.round(totalExerciseCalories);
    if (remainingElement) remainingElement.textContent = Math.round(remainingCalories).toLocaleString();
}
