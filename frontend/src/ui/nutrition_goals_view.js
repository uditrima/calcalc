// Nutrition Goals View
import { KNOB_RANGES, MACRO_LABELS } from './nutrition_goals_constants.js';
import { parseNumeric, formatNumber } from './nutrition_goals_formatters.js';
import { setKnobValue, updateGoalPercentages } from './nutrition_goals_ui_helpers.js';
import { addCaloriesKnobClickTracking, updateRelatedKnobs, updateGoalValue } from './nutrition_goals_controllers.js';

export function createLoadingSection() {
    const section = document.createElement('div');
    section.className = 'loading-section';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    section.appendChild(spinner);
    
    const text = document.createElement('p');
    text.textContent = 'Indlæser mål...';
    section.appendChild(text);
    
    return section;
}

export function createErrorSection(error) {
    const section = document.createElement('div');
    section.className = 'error-section';
    
    const title = document.createElement('h3');
    title.textContent = 'Fejl ved indlæsning';
    section.appendChild(title);
    
    const message = document.createElement('p');
    message.textContent = error || 'Der opstod en fejl ved indlæsning af dine mål.';
    section.appendChild(message);
    
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Prøv igen';
    retryButton.className = 'retry-button';
    retryButton.addEventListener('click', () => {
        // This will be handled by the main component
        window.dispatchEvent(new CustomEvent('retryGoals'));
    });
    section.appendChild(retryButton);
    
    return section;
}

export function createGoalsSection(formattedGoals) {
    const section = document.createElement('div');
    section.className = 'goals-section';
    
    const title = document.createElement('h2');
    title.textContent = 'Dine Mål';
    section.appendChild(title);
    
    // Calories goal
    const caloriesGoal = createGoalItem('Kalorier', formattedGoals.calories.formatted, '');
    section.appendChild(caloriesGoal);
    
    // Carbohydrates goal
    const carbsGoal = createGoalItem('Kulhydrater', formattedGoals.carbs.formatted, formattedGoals.carbs.percentage);
    section.appendChild(carbsGoal);
    
    // Protein goal
    const proteinGoal = createGoalItem('Protein', formattedGoals.protein.formatted, formattedGoals.protein.percentage);
    section.appendChild(proteinGoal);
    
    // Fat goal
    const fatGoal = createGoalItem('Fedt', formattedGoals.fat.formatted, formattedGoals.fat.percentage);
    section.appendChild(fatGoal);
    
    // Add action buttons
    const actionButtons = createActionButtons();
    section.appendChild(actionButtons);
    
    return section;
}

function createGoalItem(label, amount, percentage) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    
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
        amountEl.textContent = amount;
        amountEl.setAttribute('data-editable', 'true');
        amountEl.setAttribute('data-original-value', amount);
        
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
        percentageEl.textContent = percentage;
        valuesContainer.appendChild(percentageEl);
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

function addKnobInteractions(knob, label) {
    let isDragging = false;
    let startX = 0;
    let startValue = 0;
    let currentValue = 0;
    
    const range = KNOB_RANGES[label] || { min: 0, max: 1000, step: 1 };
    
    const updateKnobValue = (value, updateRelated = false) => {
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
        
        // Update the goal amount display (if it exists)
        const goalItem = knob.closest('.goal-item');
        if (goalItem) {
            const goalAmount = goalItem.querySelector('.goal-amount');
            if (goalAmount) {
                goalAmount.textContent = formattedValue;
                goalAmount.setAttribute('data-original-value', formattedValue);
            }
            
            // Update percentage if this is a macro nutrient
            if (MACRO_LABELS.includes(label)) {
                updateGoalPercentages({ 
                    protein_target: label === 'Protein' ? value : parseFloat(document.querySelector('#protein-knob')?.getAttribute('data-value') || 0),
                    carbs_target: label === 'Kulhydrater' ? value : parseFloat(document.querySelector('#carbs-knob')?.getAttribute('data-value') || 0),
                    fat_target: label === 'Fedt' ? value : parseFloat(document.querySelector('#fat-knob')?.getAttribute('data-value') || 0),
                    daily_calories: parseFloat(document.querySelector('#calories-knob')?.getAttribute('data-value') || 0)
                });
            }
        }
        
        // Store value locally (don't save to backend yet)
        knob.setAttribute('data-value', value);
        
        // Only update related knobs when explicitly requested (not during drag)
        if (updateRelated) {
            updateRelatedKnobs(label, value);
        }
        
        currentValue = value;
    };
    
    const startDrag = (e) => {
        isDragging = true;
        startX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        startValue = currentValue;
        
        knob.classList.add('knob-dragging');
        e.preventDefault();
    };
    
    const drag = (e) => {
        if (!isDragging) return;
        
        const currentX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const deltaX = currentX - startX;
        
        // Convert horizontal movement to value change
        const sensitivity = 2;
        const valueChange = (deltaX / 100) * (range.max - range.min) * sensitivity;
        const newValue = startValue + valueChange;
        
        updateKnobValue(newValue, false);
        e.preventDefault();
    };
    
    const endDrag = (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        knob.classList.remove('knob-dragging');
        
        updateKnobValue(currentValue, true);
        e.preventDefault();
    };
    
    // Mouse events
    knob.addEventListener('mousedown', startDrag);
    
    // Touch events
    knob.addEventListener('touchstart', startDrag, { passive: false });
    
    // Global mouse/touch events for dragging
    const globalMouseMove = (e) => {
        if (isDragging) drag(e);
    };
    
    const globalMouseUp = (e) => {
        if (isDragging) {
            endDrag(e);
            document.removeEventListener('mousemove', globalMouseMove);
            document.removeEventListener('mouseup', globalMouseUp);
        }
    };
    
    const globalTouchMove = (e) => {
        if (isDragging) drag(e);
    };
    
    const globalTouchEnd = (e) => {
        if (isDragging) {
            endDrag(e);
            document.removeEventListener('touchmove', globalTouchMove);
            document.removeEventListener('touchend', globalTouchEnd);
        }
    };
    
    // Add global listeners when drag starts
    const originalStartDrag = startDrag;
    const startDragWithGlobalListeners = (e) => {
        originalStartDrag(e);
        document.addEventListener('mousemove', globalMouseMove);
        document.addEventListener('mouseup', globalMouseUp);
        document.addEventListener('touchmove', globalTouchMove);
        document.addEventListener('touchend', globalTouchEnd);
    };
    
    knob.removeEventListener('mousedown', startDrag);
    knob.removeEventListener('touchstart', startDrag);
    knob.addEventListener('mousedown', startDragWithGlobalListeners);
    knob.addEventListener('touchstart', startDragWithGlobalListeners, { passive: false });
    
    // Initialize with current value
    const knobValue = knob.getAttribute('data-value');
    const initialValue = parseNumeric(knobValue) || range.min;
    currentValue = initialValue;
    knob._currentValue = currentValue;
}

function makeAmountEditable(amountEl, label) {
    if (amountEl.querySelector('input')) return;
    
    const currentValue = amountEl.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.className = 'goal-amount-input';
    
    amountEl.innerHTML = '';
    amountEl.appendChild(input);
    
    input.focus();
    input.select();
    
    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue && newValue !== currentValue) {
            const numericValue = parseNumeric(newValue);
            if (!isNaN(numericValue)) {
                const formattedValue = formatNumber(numericValue);
                amountEl.textContent = formattedValue;
                amountEl.setAttribute('data-original-value', formattedValue);
                updateGoalValue(label, newValue);
            } else {
                amountEl.textContent = currentValue;
            }
        } else {
            amountEl.textContent = currentValue;
        }
        
        const finalValue = amountEl.getAttribute('data-original-value') || currentValue;
        amountEl.innerHTML = finalValue;
    };
    
    const cancelEdit = () => {
        amountEl.textContent = currentValue;
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

function createActionButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'goals-action-buttons';
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'goals-cancel-btn';
    cancelButton.textContent = 'Annuller';
    cancelButton.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('reloadGoals'));
    });
    
    // Commit button
    const commitButton = document.createElement('button');
    commitButton.className = 'goals-commit-btn';
    commitButton.textContent = 'Gem ændringer';
    commitButton.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('commitGoals'));
    });
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(commitButton);
    
    return buttonContainer;
}
