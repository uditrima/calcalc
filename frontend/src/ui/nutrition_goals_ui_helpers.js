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
    let formattedValue = formatNumber(value);
    
    // Add "g" suffix for macro nutrients
    if (MACRO_LABELS.includes(label)) {
        formattedValue = `${formattedValue}g`;
    }
    
    // Update goal amount display - ONLY in goals-section
    const goalItem = knob.closest('.goal-item');
    if (goalItem) {
        // Only update if this goal-item is within a goals-section (not add-food-section)
        const goalsSection = goalItem.closest('.goals-section');
        if (goalsSection) {
            const goalAmount = goalItem.querySelector('.goal-amount');
            if (goalAmount) {
                if (label === 'Kalorier') {
                    // Update calories amount spans
                    const amountNumber = goalAmount.querySelector('.amount-number');
                    if (amountNumber) {
                        amountNumber.textContent = formattedValue;
                    }
                } else {
                    // Update macro amount normally
                    goalAmount.textContent = formattedValue;
                }
                goalAmount.setAttribute('data-original-value', formattedValue);
            }
        }
        
        // Update calories display for macros
        if (MACRO_LABELS.includes(label)) {
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
    
    // Update the knob's internal currentValue
    knob._currentValue = value;
    
    // Activate commit button when changes are made
    const commitBtn = document.querySelector('.goals-commit-btn');
    if (commitBtn) {
        commitBtn.classList.remove('dimmed');
    }
}

// Helper function to calculate percentage color
function calculatePercentageColor(percentage) {
    // Clamp percentage between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    // Convert percentage to 0-1 range
    const normalizedPercentage = clampedPercentage / 100;
    
    // Interpolate between orange (0%) and green (100%)
    // Orange: rgb(171, 116, 72)
    // Green: rgb(108, 152, 122)
    const orangeR = 171, orangeG = 116, orangeB = 72;
    const greenR = 108, greenG = 152, greenB = 122;
    
    const r = Math.round(orangeR + (greenR - orangeR) * normalizedPercentage);
    const g = Math.round(orangeG + (greenG - orangeG) * normalizedPercentage);
    const b = Math.round(orangeB + (greenB - orangeB) * normalizedPercentage);
    
    return `rgb(${r}, ${g}, ${b})`;
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
            goalPercentage.setAttribute('data-percentage', percentage);
            
            // Set CSS custom property for color
            const color = calculatePercentageColor(percentage);
            goalPercentage.style.setProperty('--percentage-color', color);
        }
    });
}

export function getKnobById(id) {
    return document.querySelector(`#${id}`);
}

export function getAllKnobs() {
    return document.querySelectorAll('.rotary-knob');
}
