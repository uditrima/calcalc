// Nutrition Goals UI Helpers
import { KNOB_RANGES, MACRO_LABELS } from './nutrition_goals_constants.js';
import { formatNumber } from './nutrition_goals_formatters.js';
import { calculateMacroPercentages } from './nutrition_goals_calculations.js';

export function setKnobValue(knob, value, label) {
    const range = KNOB_RANGES[label] || { min: 0, max: 1000, step: 1 };
    
    // Clamp value to range
    value = Math.max(range.min, Math.min(range.max, value));
    
    // Round to step
    value = Math.round(value / range.step) * range.step;
    
    // Update knob visual
    const percentage = ((value - range.min) / (range.max - range.min)) * 100;
    knob.style.setProperty('--knob-position', `${percentage}%`);
    knob.setAttribute('data-value', value);
    
    // Update display
    const formattedValue = formatNumber(value);
    
    // Update goal amount display
    const goalItem = knob.closest('.goal-item');
    if (goalItem) {
        const goalAmount = goalItem.querySelector('.goal-amount');
        if (goalAmount) {
            goalAmount.textContent = formattedValue;
            goalAmount.setAttribute('data-original-value', formattedValue);
        }
    }
    
    // Update the knob's internal currentValue
    knob._currentValue = value;
}

export function updateGoalPercentages(goals) {
    const percentages = calculateMacroPercentages(
        goals.protein_target,
        goals.carbs_target,
        goals.fat_target,
        goals.daily_calories
    );
    
    // Update all goal percentage displays
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach(goalItem => {
        const labelElement = goalItem.querySelector('.goal-label');
        const goalPercentage = goalItem.querySelector('.goal-percentage');
        
        if (labelElement && goalPercentage) {
            const label = labelElement.textContent;
            let percentage = 0;
            switch(label) {
                case 'Protein': percentage = percentages.protein; break;
                case 'Kulhydrater': percentage = percentages.carbs; break;
                case 'Fedt': percentage = percentages.fat; break;
            }
            goalPercentage.textContent = `${percentage}%`;
        }
    });
}

export function getKnobById(id) {
    return document.querySelector(`#${id}`);
}

export function getAllKnobs() {
    return document.querySelectorAll('.rotary-knob');
}
