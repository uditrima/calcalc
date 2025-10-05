// Nutrition Goals Knob Interactions
// Main coordinator for knob interactions

import { parseNumeric } from '../nutrition_goals_formatters.js';
import { setKnobValue } from '../nutrition_goals_ui_helpers.js';
import { addCaloriesKnobClickTracking } from '../nutrition_goals_controllers.js';
import { createKnobValueUpdater } from './knob_value_updater.js';
import { createKnobDragHandler } from './knob_drag_handler.js';

export function addKnobInteractions(knob, label) {
    // Create the value updater
    const updateKnobValue = createKnobValueUpdater(knob, label);
    
    // Create the drag handler
    const updateCurrentValue = createKnobDragHandler(knob, label, updateKnobValue);
    
    // Add special handling for calories knob to track user clicks
    if (label === 'Kalorier') {
        addCaloriesKnobClickTracking(knob);
    }
    
    // Initialize knob value after DOM is ready
    setTimeout(() => {
        const knobValue = knob.getAttribute('data-value');
        const initialValue = parseNumeric(knobValue) || 0;
        if (initialValue > 0) {
            setKnobValue(knob, initialValue, label);
        }
    }, 0);
}
