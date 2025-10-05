// Nutrition Goals Knob Value Updater
// Main coordinator for knob value updates

import { KNOB_RANGES, MACRO_LABELS } from '../nutrition_goals_constants.js';
import { formatNumber } from '../nutrition_goals_formatters.js';
import { updateRelatedKnobs } from '../nutrition_goals_controllers.js';
import { activateCommitButton } from './view_utils.js';
import { updateGoalAmountDisplay, updateMacroCaloriesDisplay } from './knob_display_updater.js';
import { updateMacroPercentages, updateMacrosFromCalories } from './knob_calculation_handler.js';

export function createKnobValueUpdater(knob, label) {
    const range = KNOB_RANGES[label] || { min: 0, max: 1000, step: 1 };
    
    return (value, updateRelated = false) => {
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
        
        // Update the goal amount display (if it exists) - ONLY in goals-section
        updateGoalAmountDisplay(knob, label, formattedValue);
        
        // Update calories display for macros
        if (MACRO_LABELS.includes(label)) {
            updateMacroCaloriesDisplay(knob, label, value);
        }
        
        // Update percentage if this is a macro nutrient
        if (MACRO_LABELS.includes(label)) {
            updateMacroPercentages(label, value);
        }
        
        // Update macros in real-time when calories knob is dragged
        if (label === 'Kalorier') {
            updateMacrosFromCalories(value);
        }
    
        // Store value locally (don't save to backend yet)
        knob.setAttribute('data-value', value);
        
        // Only update related knobs when explicitly requested (not during drag)
        if (updateRelated) {
            updateRelatedKnobs(label, value);
        }
        
        // Activate commit button when changes are made
        activateCommitButton();
    };
}
