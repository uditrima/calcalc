// Nutrition Goals Knob Calculation Handler
// Handles complex calculations for knob interactions

import { AppState } from '../../state/app_state.js';
import { formatNumber } from '../nutrition_goals_formatters.js';
import { updateGoalPercentages } from '../nutrition_goals_ui_helpers.js';
import { updateMacroKnobDisplay } from './knob_display_updater.js';

export function updateMacroPercentages(label, value) {
    // Calculate new calories based on current macro values
    const protein = label === 'Protein' ? value : parseFloat(document.querySelector('#protein-knob')?.getAttribute('data-value') || 0);
    const carbs = label === 'Kulhydrater' ? value : parseFloat(document.querySelector('#carbs-knob')?.getAttribute('data-value') || 0);
    const fat = label === 'Fedt' ? value : parseFloat(document.querySelector('#fat-knob')?.getAttribute('data-value') || 0);
    
    // Calculate calories from macros
    const proteinCalories = protein * 4;
    const carbsCalories = carbs * 4;
    const fatCalories = fat * 9;
    const totalCalories = proteinCalories + carbsCalories + fatCalories;
    
    // Update calories knob in real-time during drag
    const caloriesKnob = document.querySelector('#calories-knob');
    if (caloriesKnob) {
        const formattedCalories = formatNumber(totalCalories);
        caloriesKnob.setAttribute('data-value', totalCalories);
        caloriesKnob.style.setProperty('--knob-position', `${((totalCalories - 0) / (3000 - 0)) * 100}%`);
        
        // Update calories display
        const caloriesGoalItem = caloriesKnob.closest('.goal-item');
        if (caloriesGoalItem) {
            const caloriesAmount = caloriesGoalItem.querySelector('.goal-amount');
            if (caloriesAmount) {
                caloriesAmount.textContent = formattedCalories;
                caloriesAmount.setAttribute('data-original-value', formattedCalories);
            }
        }
    }
    
    updateGoalPercentages({ 
        protein_target: protein,
        carbs_target: carbs,
        fat_target: fat,
        daily_calories: totalCalories
    });
}

export function updateMacrosFromCalories(caloriesValue) {
    // Get current goals to calculate macro proportions
    const currentGoals = AppState.getGoals();
    if (currentGoals) {
        const newMacros = AppState.calculateMacrosFromCalories(
            caloriesValue,
            currentGoals.protein_target,
            currentGoals.carbs_target,
            currentGoals.fat_target
        );
        
        // Update macro knobs in real-time during drag
        updateMacroKnobDisplay('protein', newMacros.protein);
        updateMacroKnobDisplay('carbs', newMacros.carbs);
        updateMacroKnobDisplay('fat', newMacros.fat);
        
        // Update percentages
        updateGoalPercentages({ 
            protein_target: newMacros.protein,
            carbs_target: newMacros.carbs,
            fat_target: newMacros.fat,
            daily_calories: caloriesValue
        });
    }
}
