// Nutrition Goals View
import { KNOB_RANGES, MACRO_LABELS } from './nutrition_goals_constants.js';
import { parseNumeric, formatNumber } from './nutrition_goals_formatters.js';
import { setKnobValue, updateGoalPercentages } from './nutrition_goals_ui_helpers.js';
import { addCaloriesKnobClickTracking, updateRelatedKnobs, updateGoalValue } from './nutrition_goals_controllers.js';

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

// Helper function to activate commit button
function activateCommitButton() {
    const commitBtn = document.querySelector('.goals-commit-btn');
    if (commitBtn) {
        commitBtn.classList.remove('dimmed');
    }
    // Update state
    window.dispatchEvent(new CustomEvent('activateCommitButton'));
}

export function createNutritionGoalsHeader() {
    const header = document.createElement('div');
    header.className = 'nutrition-goals-header';
    
    // Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.className = 'go-back-btn';
    goBackBtn.innerHTML = '←';
    goBackBtn.addEventListener('click', () => {
        const customEvent = new CustomEvent('onGoBack', {
            bubbles: true
        });
        const appContainer = document.querySelector('#app');
        if (appContainer) {
            appContainer.dispatchEvent(customEvent);
        } else {
            document.dispatchEvent(customEvent);
        }
    });
    header.appendChild(goBackBtn);
    
    // Title
    const title = document.createElement('h1');
    title.textContent = 'Næringsstoffer Mål';
    header.appendChild(title);
    
    return header;
}

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
    
    // Check if formattedGoals is null or undefined
    if (!formattedGoals) {
        console.warn('formattedGoals is null, using fallback values');
        // Use fallback values when goals are not loaded
        const fallbackGoals = {
            calories: { value: 1500, formatted: '1,500' },
            protein: { value: 133, formatted: '133g', percentage: '30%' },
            carbs: { value: 180, formatted: '180g', percentage: '45%' },
            fat: { value: 20, formatted: '20g', percentage: '25%' }
        };
        
        const caloriesGoal = createGoalItem('Kalorier', fallbackGoals.calories.formatted, '');
        section.appendChild(caloriesGoal);
        
        const carbsGoal = createGoalItem('Kulhydrater', fallbackGoals.carbs.formatted, fallbackGoals.carbs.percentage);
        section.appendChild(carbsGoal);
        
        const proteinGoal = createGoalItem('Protein', fallbackGoals.protein.formatted, fallbackGoals.protein.percentage);
        section.appendChild(proteinGoal);
        
        const fatGoal = createGoalItem('Fedt', fallbackGoals.fat.formatted, fallbackGoals.fat.percentage);
        section.appendChild(fatGoal);
    } else {
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
    }
    
    // Add action buttons
    const actionButtons = createActionButtons();
    section.appendChild(actionButtons);
    
    return section;
}

function createGoalItem(label, amount, percentage) {
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
        let formattedValue = formatNumber(value);
        
        // Add "g" suffix for macro nutrients
        if (MACRO_LABELS.includes(label)) {
            formattedValue = `${formattedValue}g`;
        }
        
        // Update the goal amount display (if it exists) - ONLY in goals-section
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
            
            // Update percentage if this is a macro nutrient
            if (MACRO_LABELS.includes(label)) {
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
            
            // Update macros in real-time when calories knob is dragged
            if (label === 'Kalorier') {
                // Get current goals to calculate macro proportions
                const currentGoals = AppState.getGoals();
                if (currentGoals) {
                    const newMacros = AppState.calculateMacrosFromCalories(
                        value,
                        currentGoals.protein_target,
                        currentGoals.carbs_target,
                        currentGoals.fat_target
                    );
                    
                    // Update macro knobs in real-time during drag
                    const proteinKnob = document.querySelector('#protein-knob');
                    const carbsKnob = document.querySelector('#carbs-knob');
                    const fatKnob = document.querySelector('#fat-knob');
                    
                    if (proteinKnob) {
                        const proteinValue = Math.round(newMacros.protein);
                        proteinKnob.setAttribute('data-value', proteinValue);
                        proteinKnob.style.setProperty('--knob-position', `${((proteinValue - 0) / (500 - 0)) * 100}%`);
                        
                        // Update protein display
                        const proteinGoalItem = proteinKnob.closest('.goal-item');
                        if (proteinGoalItem) {
                            const proteinAmount = proteinGoalItem.querySelector('.goal-amount');
                            if (proteinAmount) {
                                proteinAmount.textContent = `${proteinValue}g`;
                                proteinAmount.setAttribute('data-original-value', `${proteinValue}g`);
                            }
                            
                            // Update protein calories display
                            const proteinCalories = proteinGoalItem.querySelector('.goal-calories');
                            if (proteinCalories) {
                                const caloriesNumber = proteinCalories.querySelector('.calories-number');
                                if (caloriesNumber) {
                                    caloriesNumber.textContent = proteinValue * 4;
                                }
                            }
                        }
                    }
                    
                    if (carbsKnob) {
                        const carbsValue = Math.round(newMacros.carbs);
                        carbsKnob.setAttribute('data-value', carbsValue);
                        carbsKnob.style.setProperty('--knob-position', `${((carbsValue - 0) / (500 - 0)) * 100}%`);
                        
                        // Update carbs display
                        const carbsGoalItem = carbsKnob.closest('.goal-item');
                        if (carbsGoalItem) {
                            const carbsAmount = carbsGoalItem.querySelector('.goal-amount');
                            if (carbsAmount) {
                                carbsAmount.textContent = `${carbsValue}g`;
                                carbsAmount.setAttribute('data-original-value', `${carbsValue}g`);
                            }
                            
                            // Update carbs calories display
                            const carbsCalories = carbsGoalItem.querySelector('.goal-calories');
                            if (carbsCalories) {
                                const caloriesNumber = carbsCalories.querySelector('.calories-number');
                                if (caloriesNumber) {
                                    caloriesNumber.textContent = carbsValue * 4;
                                }
                            }
                        }
                    }
                    
                    if (fatKnob) {
                        const fatValue = Math.round(newMacros.fat);
                        fatKnob.setAttribute('data-value', fatValue);
                        fatKnob.style.setProperty('--knob-position', `${((fatValue - 0) / (200 - 0)) * 100}%`);
                        
                        // Update fat display
                        const fatGoalItem = fatKnob.closest('.goal-item');
                        if (fatGoalItem) {
                            const fatAmount = fatGoalItem.querySelector('.goal-amount');
                            if (fatAmount) {
                                fatAmount.textContent = `${fatValue}g`;
                                fatAmount.setAttribute('data-original-value', `${fatValue}g`);
                            }
                            
                            // Update fat calories display
                            const fatCalories = fatGoalItem.querySelector('.goal-calories');
                            if (fatCalories) {
                                const caloriesNumber = fatCalories.querySelector('.calories-number');
                                if (caloriesNumber) {
                                    caloriesNumber.textContent = fatValue * 9;
                                }
                            }
                        }
                    }
                    
                    // Update percentages
                    updateGoalPercentages({ 
                        protein_target: newMacros.protein,
                        carbs_target: newMacros.carbs,
                        fat_target: newMacros.fat,
                        daily_calories: value
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
        
        // Activate commit button when changes are made
        activateCommitButton();
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
        const sensitivity = 0.07; // 30% less sensitive than 0.1 for even finer control
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

function createActionButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'goals-action-buttons';
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'goals-cancel-btn';
    cancelButton.textContent = 'Annuller';
    cancelButton.addEventListener('click', () => {
        // Dim the commit button when canceling
        window.dispatchEvent(new CustomEvent('dimCommitButton'));
        window.dispatchEvent(new CustomEvent('reloadGoals'));
    });
    
    // Commit button (state from goals state)
    const commitButton = document.createElement('button');
    commitButton.className = 'goals-commit-btn';
    commitButton.textContent = 'Gem ændringer';
    commitButton.addEventListener('click', () => {
        if (!commitButton.classList.contains('dimmed')) {
            window.dispatchEvent(new CustomEvent('commitGoals'));
        }
    });
    
    // Apply dimmed state based on goals state
    setTimeout(() => {
        const isDimmed = window.goalsState?.isCommitButtonDimmed?.() ?? true;
        if (isDimmed) {
            commitButton.classList.add('dimmed');
        }
    }, 0);
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(commitButton);
    
    return buttonContainer;
}
