// Nutrition Goals Amount Editing
// Handles inline editing of goal amounts

import { MACRO_LABELS } from '../nutrition_goals_constants.js';
import { parseNumeric, formatNumber } from '../nutrition_goals_formatters.js';
import { updateGoalValue } from '../nutrition_goals_controllers.js';
import { activateCommitButton } from './view_utils.js';

export function makeAmountEditable(amountEl, label) {
    if (amountEl.querySelector('input')) return;
    
    let currentValue, editValue;
    
    if (label === 'Kalorier') {
        // For calories, get the number from the span
        const amountNumber = amountEl.querySelector('.amount-number');
        currentValue = amountNumber ? amountNumber.textContent : amountEl.textContent;
        editValue = currentValue;
    } else {
        // For macros, handle "g" suffix
        currentValue = amountEl.textContent;
        editValue = currentValue;
        if (MACRO_LABELS.includes(label) && currentValue.endsWith('g')) {
            editValue = currentValue.slice(0, -1);
        }
    }
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = editValue;
    input.className = 'goal-amount-input';
    
    amountEl.innerHTML = '';
    amountEl.appendChild(input);
    
    input.focus();
    input.select();
    
    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue && newValue !== editValue) {
            const numericValue = parseNumeric(newValue);
            if (!isNaN(numericValue)) {
                let formattedValue = formatNumber(numericValue);
                
                if (label === 'Kalorier') {
                    // Update calories amount spans
                    const amountNumber = amountEl.querySelector('.amount-number');
                    if (amountNumber) {
                        amountNumber.textContent = formattedValue;
                    }
                    amountEl.setAttribute('data-original-value', formattedValue);
                } else {
                    // Add "g" suffix for macro nutrients
                    if (MACRO_LABELS.includes(label)) {
                        formattedValue = `${formattedValue}g`;
                    }
                    amountEl.textContent = formattedValue;
                    amountEl.setAttribute('data-original-value', formattedValue);
                }
                
                updateGoalValue(label, newValue);
                
                // Activate commit button when changes are made
                activateCommitButton();
            } else {
                // Restore original value
                if (label === 'Kalorier') {
                    const amountNumber = amountEl.querySelector('.amount-number');
                    if (amountNumber) {
                        amountNumber.textContent = currentValue;
                    }
                } else {
                    amountEl.textContent = currentValue;
                }
            }
        } else {
            // Restore original value
            if (label === 'Kalorier') {
                const amountNumber = amountEl.querySelector('.amount-number');
                if (amountNumber) {
                    amountNumber.textContent = currentValue;
                }
            } else {
                amountEl.textContent = currentValue;
            }
        }
        
        // Remove input and restore spans
        amountEl.innerHTML = '';
        if (label === 'Kalorier') {
            const amountNumber = document.createElement('span');
            amountNumber.className = 'amount-number';
            amountNumber.textContent = amountEl.getAttribute('data-original-value') || currentValue;
            
            const amountSuffix = document.createElement('span');
            amountSuffix.className = 'amount-suffix';
            amountSuffix.textContent = ' kcal';
            
            amountEl.appendChild(amountNumber);
            amountEl.appendChild(amountSuffix);
        } else {
            amountEl.innerHTML = amountEl.getAttribute('data-original-value') || currentValue;
        }
    };
    
    const cancelEdit = () => {
        // Remove input and restore spans
        amountEl.innerHTML = '';
        if (label === 'Kalorier') {
            const amountNumber = document.createElement('span');
            amountNumber.className = 'amount-number';
            amountNumber.textContent = currentValue;
            
            const amountSuffix = document.createElement('span');
            amountSuffix.className = 'amount-suffix';
            amountSuffix.textContent = ' kcal';
            
            amountEl.appendChild(amountNumber);
            amountEl.appendChild(amountSuffix);
        } else {
            amountEl.textContent = currentValue;
        }
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
