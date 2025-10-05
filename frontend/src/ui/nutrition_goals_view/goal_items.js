// Nutrition Goals Goal Items
// Creates individual goal items and rotary knobs

import { KNOB_RANGES, MACRO_LABELS } from '../nutrition_goals_constants.js';
import { parseNumeric, formatNumber } from '../nutrition_goals_formatters.js';
import { setKnobValue, updateGoalPercentages } from '../nutrition_goals_ui_helpers.js';
import { addCaloriesKnobClickTracking, updateRelatedKnobs, updateGoalValue } from '../nutrition_goals_controllers.js';
import { calculatePercentageColor } from './view_utils.js';
import { addKnobInteractions } from './knob_interactions.js';
import { makeAmountEditable } from './amount_editing.js';

export function createGoalItem(label, amount, percentage) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    
    // Add data attribute for macro type styling
    if (label === 'Protein') {
        item.setAttribute('data-macro', 'protein');
    } else if (label === 'Kulhydrater') {
        item.setAttribute('data-macro', 'carbs');
    } else if (label === 'Fedt') {
        item.setAttribute('data-macro', 'fat');
    } else if (label === 'Kalorier') {
        item.setAttribute('data-macro', 'calories');
    }
    
    const labelEl = document.createElement('div');
    labelEl.className = 'goal-label';
    labelEl.textContent = label;
    item.appendChild(labelEl);
    
    const valuesContainer = document.createElement('div');
    valuesContainer.className = 'goal-values';
    
    if (amount) {
        // Create rotary knob container
        const knobContainer = document.createElement('div');
        knobContainer.className = 'knob-container';
        
        // Create rotary knob
        const knob = createRotaryKnob(label, amount);
        knobContainer.appendChild(knob);
        
        // Create amount display
        const amountEl = document.createElement('div');
        amountEl.className = 'goal-amount';
        amountEl.setAttribute('data-editable', 'true');
        amountEl.setAttribute('data-original-value', amount);
        
        // For calories, create separate spans for number and suffix
        if (label === 'Kalorier') {
            const amountNumber = document.createElement('span');
            amountNumber.className = 'amount-number';
            amountNumber.textContent = amount;
            
            const amountSuffix = document.createElement('span');
            amountSuffix.className = 'amount-suffix';
            amountSuffix.textContent = ' kcal';
            
            amountEl.appendChild(amountNumber);
            amountEl.appendChild(amountSuffix);
        } else {
            // For macros, just set the text content normally
            amountEl.textContent = amount;
        }
        
        // Add click handler for editing
        amountEl.addEventListener('click', () => {
            makeAmountEditable(amountEl, label);
        });
        
        knobContainer.appendChild(amountEl);
        valuesContainer.appendChild(knobContainer);
    }
    
    if (percentage) {
        const percentageEl = document.createElement('div');
        percentageEl.className = 'goal-percentage';
        // Round percentage for display
        const percentageValue = parseFloat(percentage.replace('%', ''));
        percentageEl.textContent = `${Math.round(percentageValue)}%`;
        
        // Extract percentage value for color calculation
        percentageEl.setAttribute('data-percentage', Math.round(percentageValue));
        
        // Set CSS custom property for color
        const color = calculatePercentageColor(percentageValue);
        percentageEl.style.setProperty('--percentage-color', color);
        
        valuesContainer.appendChild(percentageEl);
    }
    
    // Add calories display for macros
    if (MACRO_LABELS.includes(label)) {
        const caloriesEl = document.createElement('div');
        caloriesEl.className = 'goal-calories';
        
        // Calculate calories for this macro
        const amountValue = parseNumeric(amount);
        const caloriesPerGram = label === 'Fedt' ? 9 : 4;
        const calories = amountValue * caloriesPerGram;
        
        // Create separate spans for number and suffix
        const caloriesNumber = document.createElement('span');
        caloriesNumber.className = 'calories-number';
        caloriesNumber.textContent = calories;
        
        const caloriesSuffix = document.createElement('span');
        caloriesSuffix.className = 'calories-suffix';
        caloriesSuffix.textContent = ' kcal';
        
        caloriesEl.appendChild(caloriesNumber);
        caloriesEl.appendChild(caloriesSuffix);
        valuesContainer.appendChild(caloriesEl);
    }
    
    item.appendChild(valuesContainer);
    return item;
}

function createRotaryKnob(label, amount) {
    const knob = document.createElement('div');
    knob.className = 'rotary-knob';
    knob.setAttribute('data-label', label);
    knob.setAttribute('data-value', amount);
    
    // Add unique IDs for all knobs
    switch(label) {
        case 'Kalorier': knob.id = 'calories-knob'; break;
        case 'Protein': knob.id = 'protein-knob'; break;
        case 'Kulhydrater': knob.id = 'carbs-knob'; break;
        case 'Fedt': knob.id = 'fat-knob'; break;
    }
    
    // Create knob visual elements
    const knobTrack = document.createElement('div');
    knobTrack.className = 'knob-track';
    
    const knobHandle = document.createElement('div');
    knobHandle.className = 'knob-handle';
    
    knob.appendChild(knobTrack);
    knob.appendChild(knobHandle);
    
    // Add interaction handlers
    addKnobInteractions(knob, label);
    
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
    
    return knob;
}
