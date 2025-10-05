// Diary Meal Sections component
import { EXTENDED_MEAL_TYPES, getMealDisplayName } from '../../data/meal_types.js';
import { createWaterSection } from './diary_water_section.js';

/**
 * Creates meal sections for the diary
 * @param {HTMLElement} container - The container element for event dispatching
 * @returns {HTMLElement} The meals container element
 */
export function createMealsContainer(container) {
    const mealsContainer = document.createElement('div');
    mealsContainer.className = 'meals-container';
    
    // Create meal sections dynamically from central definition
    EXTENDED_MEAL_TYPES.forEach(mealType => {
        const mealSection = createMealSection(getMealDisplayName(mealType), mealType, container);
        mealsContainer.appendChild(mealSection);
    });
    
    // Motion
    const motionSection = createExerciseSection('Motion', 'motion', container);
    mealsContainer.appendChild(motionSection);
    
    // Water Section
    const waterSection = createWaterSection(container);
    mealsContainer.appendChild(waterSection);
    
    return mealsContainer;
}

/**
 * Creates a meal section
 * @param {string} title - The meal title
 * @param {string} mealType - The meal type
 * @param {HTMLElement} container - The container element for event dispatching
 * @returns {HTMLElement} The meal section element
 */
export function createMealSection(title, mealType, container) {
    const section = document.createElement('div');
    section.className = 'meal-section';
    section.setAttribute('data-meal-type', mealType);
    section.setAttribute('data-meal', mealType);
    
    // Line 1: Title, add link, calories and more menu
    const line1 = document.createElement('div');
    line1.className = 'meal-line-1';
    
    const leftSection = document.createElement('div');
    leftSection.className = 'meal-left-section';
    
    const mealTitle = document.createElement('span');
    mealTitle.className = 'meal-title-diary';
    mealTitle.dataset.mealtype = mealType;
    mealTitle.textContent = title;
    leftSection.appendChild(mealTitle);
    
    const addLink = document.createElement('span');
    addLink.className = 'add-food-link';
    addLink.textContent = 'TILFØJ FØDEVARE';
    addLink.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddFood', {
            detail: { mealType },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    leftSection.appendChild(addLink);
    
    line1.appendChild(leftSection);
    
    const rightSection = document.createElement('div');
    rightSection.className = 'meal-right-section';
    
    const mealCalories = document.createElement('span');
    mealCalories.className = 'meal-calories';
    mealCalories.textContent = '0';
    rightSection.appendChild(mealCalories);
    
    const moreMenu = document.createElement('button');
    moreMenu.className = 'meal-more-menu';
    moreMenu.innerHTML = '⋯';
    moreMenu.title = 'Mere menu';
    rightSection.appendChild(moreMenu);
    
    line1.appendChild(rightSection);
    
    section.appendChild(line1);
    
    // Line 2: Food list container
    const foodList = document.createElement('div');
    foodList.className = 'diary-food-list';
    section.appendChild(foodList);
    
    return section;
}

/**
 * Creates an exercise section
 * @param {string} title - The exercise title
 * @param {string} exerciseType - The exercise type
 * @param {HTMLElement} container - The container element for event dispatching
 * @returns {HTMLElement} The exercise section element
 */
export function createExerciseSection(title, exerciseType, container) {
    const section = document.createElement('div');
    section.className = 'meal-section exercise-section';
    section.setAttribute('data-exercise-type', exerciseType);
    
    // Line 1: Title and calories
    const line1 = document.createElement('div');
    line1.className = 'meal-line-1';
    
    const exerciseTitle = document.createElement('span');
    exerciseTitle.className = 'meal-title-diary';
    exerciseTitle.textContent = title;
    line1.appendChild(exerciseTitle);
    
    const exerciseCalories = document.createElement('span');
    exerciseCalories.className = 'meal-calories';
    exerciseCalories.textContent = '0';
    line1.appendChild(exerciseCalories);
    
    section.appendChild(line1);
    
    // Line 2: Add button and more menu
    const line2 = document.createElement('div');
    line2.className = 'meal-line-2';
    
    const addButton = document.createElement('button');
    addButton.className = 'add-exercise-btn';
    addButton.textContent = 'TILFØJ MOTION';
    addButton.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddExercise', {
            detail: { exerciseType },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    line2.appendChild(addButton);
    
    const moreMenu = document.createElement('button');
    moreMenu.className = 'meal-more-menu';
    moreMenu.innerHTML = '⋯';
    moreMenu.title = 'Mere menu';
    line2.appendChild(moreMenu);
    
    section.appendChild(line2);
    
    return section;
}

