// Nutrition Goals Knob Display Updater
// Handles updating display elements for knob values

import { MACRO_LABELS } from '../nutrition_goals_constants.js';
import { formatNumber } from '../nutrition_goals_formatters.js';

export function updateGoalAmountDisplay(knob, label, formattedValue) {
    const goalItem = knob.closest('.goal-item');
    if (goalItem) {
        // Only update if this goal-item is within a goals-section (not add-food-section)
        const goalsSection = goalItem.closest('.goals-section');
        if (goalsSection) {
            const goalAmount = goalItem.querySelector('.goal-amount');
            if (goalAmount) {
                console.log(`Updating goal-amount for ${label}: ${formattedValue}`);
                
                if (label === 'Kalorier') {
                    // Update calories amount spans
                    const amountNumber = goalAmount.querySelector('.amount-number');
                    if (amountNumber) {
                        console.log(`Updating calories amount-number from ${amountNumber.textContent} to ${formattedValue}`);
                        amountNumber.textContent = formattedValue;
                        goalAmount.setAttribute('data-original-value', formattedValue);
                    } else {
                        console.log('No amount-number found for calories');
                    }
                } else {
                    // Update macro amount normally
                    goalAmount.textContent = formattedValue;
                    goalAmount.setAttribute('data-original-value', formattedValue);
                }
            } else {
                console.log(`No goal-amount found for ${label}`);
            }
        } else {
            console.log(`Goal-item for ${label} is not in goals-section, skipping update`);
        }
    } else {
        console.log(`No goal-item found for ${label}`);
    }
}

export function updateMacroCaloriesDisplay(knob, label, value) {
    const goalItem = knob.closest('.goal-item');
    if (goalItem) {
        const goalCalories = goalItem.querySelector('.goal-calories');
        if (goalCalories) {
            const caloriesPerGram = label === 'Fedt' ? 9 : 4;
            const calories = value * caloriesPerGram;
            
            // Update the calories number span
            const caloriesNumber = goalCalories.querySelector('.calories-number');
            if (caloriesNumber) {
                caloriesNumber.textContent = calories;
            }
        }
    }
}

export function updateMacroKnobDisplay(macroType, value) {
    const knobId = macroType === 'protein' ? 'protein-knob' : 
                   macroType === 'carbs' ? 'carbs-knob' : 'fat-knob';
    const label = macroType === 'protein' ? 'Protein' : 
                  macroType === 'carbs' ? 'Kulhydrater' : 'Fedt';
    const maxRange = macroType === 'fat' ? 200 : 500;
    const caloriesPerGram = macroType === 'fat' ? 9 : 4;
    
    const knob = document.querySelector(`#${knobId}`);
    if (knob) {
        const roundedValue = Math.round(value);
        knob.setAttribute('data-value', roundedValue);
        knob.style.setProperty('--knob-position', `${((roundedValue - 0) / (maxRange - 0)) * 100}%`);
        
        // Update display
        const goalItem = knob.closest('.goal-item');
        if (goalItem) {
            const amount = goalItem.querySelector('.goal-amount');
            if (amount) {
                amount.textContent = `${roundedValue}g`;
                amount.setAttribute('data-original-value', `${roundedValue}g`);
            }
            
            // Update calories display
            const calories = goalItem.querySelector('.goal-calories');
            if (calories) {
                const caloriesNumber = calories.querySelector('.calories-number');
                if (caloriesNumber) {
                    caloriesNumber.textContent = roundedValue * caloriesPerGram;
                }
            }
        }
    }
}
