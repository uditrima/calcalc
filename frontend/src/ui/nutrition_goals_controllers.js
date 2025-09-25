// Nutrition Goals Controllers
import { AppState } from '../state/app_state.js';
import { ApiClient } from '../data/api.js';
import { LABEL_TO_FIELD_MAP, MACRO_LABELS } from './nutrition_goals_constants.js';
import { parseNumeric } from './nutrition_goals_formatters.js';
import { calculateTotalCaloriesFromMacros, calculateMacroPercentages } from './nutrition_goals_calculations.js';
import { setKnobValue, updateGoalPercentages, getKnobById, getAllKnobs } from './nutrition_goals_ui_helpers.js';

// Initialize API client
const api = new ApiClient();

// Flag to track if calories knob was clicked by user
let caloriesKnobClicked = false;

export function addCaloriesKnobClickTracking(knob) {
    const startTracking = () => {
        caloriesKnobClicked = true;
    };
    
    const stopTracking = () => {
        setTimeout(() => {
            caloriesKnobClicked = false;
        }, 100);
    };
    
    knob.addEventListener('mousedown', startTracking);
    document.addEventListener('mouseup', stopTracking);
    
    knob.addEventListener('touchstart', startTracking);
    document.addEventListener('touchend', stopTracking);
}

export function updateRelatedKnobs(changedLabel, newValue) {
    if (MACRO_LABELS.includes(changedLabel)) {
        updateCaloriesKnob();
    } else if (changedLabel === 'Kalorier' && caloriesKnobClicked) {
        updateMacroKnobs(newValue);
    }
}

function updateCaloriesKnob() {
    // Get current values from knobs instead of goals state
    const proteinKnob = getKnobById('protein-knob');
    const carbsKnob = getKnobById('carbs-knob');
    const fatKnob = getKnobById('fat-knob');
    
    if (!proteinKnob || !carbsKnob || !fatKnob) return;
    
    const protein = parseFloat(proteinKnob.getAttribute('data-value') || 0);
    const carbs = parseFloat(carbsKnob.getAttribute('data-value') || 0);
    const fat = parseFloat(fatKnob.getAttribute('data-value') || 0);
    
    const newCalories = calculateTotalCaloriesFromMacros(protein, carbs, fat);
    
    const caloriesKnob = getKnobById('calories-knob');
    if (caloriesKnob) {
        setKnobValue(caloriesKnob, newCalories, 'Kalorier');
    }
}

function updateMacroKnobs(caloriesValue) {
    const currentGoals = AppState.getGoals();
    if (!currentGoals) return;
    
    const newMacros = AppState.calculateMacrosFromCalories(
        caloriesValue,
        currentGoals.protein_target,
        currentGoals.carbs_target,
        currentGoals.fat_target
    );
    
    const proteinKnob = getKnobById('protein-knob');
    const carbsKnob = getKnobById('carbs-knob');
    const fatKnob = getKnobById('fat-knob');
    
    if (proteinKnob) setKnobValue(proteinKnob, Math.round(newMacros.protein), 'Protein');
    if (carbsKnob) setKnobValue(carbsKnob, Math.round(newMacros.carbs), 'Kulhydrater');
    if (fatKnob) setKnobValue(fatKnob, Math.round(newMacros.fat), 'Fedt');
    
    // Update all percentages after macro changes
    updateGoalPercentages(currentGoals);
}

export async function commitChanges() {
    const currentValues = {};
    const knobs = getAllKnobs();
    
    knobs.forEach(knob => {
        const label = knob.getAttribute('data-label');
        const value = parseFloat(knob.getAttribute('data-value'));
        const fieldName = LABEL_TO_FIELD_MAP[label];
        if (fieldName) {
            currentValues[fieldName] = value;
        }
    });
    
    try {
        // Save to database via API
        const response = await api.setGoals(currentValues);
        
        if (response && response.success) {
            // Update local state only after successful database save
            AppState.setGoals(currentValues);
            console.log('Goals saved successfully:', currentValues);
            
            // Trigger global data refresh across the application
            window.dispatchEvent(new CustomEvent('goalsCommitted', { 
                detail: { goals: currentValues } 
            }));
            
            // Dim the commit button after successful save
            const commitBtn = document.querySelector('.goals-commit-btn');
            if (commitBtn) {
                commitBtn.classList.add('dimmed');
            }
        } else {
            console.error('Failed to save goals to database:', response);
        }
    } catch (error) {
        console.error('Error saving goals:', error);
    }
}

export function updateGoalValue(label, newValue) {
    const currentGoals = AppState.getGoals();
    if (!currentGoals) return;
    
    const numericValue = parseNumeric(newValue);
    if (isNaN(numericValue)) return;
    
    const fieldName = LABEL_TO_FIELD_MAP[label];
    if (!fieldName) return;
    
    const updatedGoals = { ...currentGoals };
    updatedGoals[fieldName] = numericValue;
    
    if (MACRO_LABELS.includes(label)) {
        // Get current values from knobs for accurate calculation
        const proteinKnob = getKnobById('protein-knob');
        const carbsKnob = getKnobById('carbs-knob');
        const fatKnob = getKnobById('fat-knob');
        
        const protein = label === 'Protein' ? numericValue : parseFloat(proteinKnob?.getAttribute('data-value') || 0);
        const carbs = label === 'Kulhydrater' ? numericValue : parseFloat(carbsKnob?.getAttribute('data-value') || 0);
        const fat = label === 'Fedt' ? numericValue : parseFloat(fatKnob?.getAttribute('data-value') || 0);
        
        const newCalories = calculateTotalCaloriesFromMacros(protein, carbs, fat);
        updatedGoals.daily_calories = newCalories;
        updateCaloriesKnob();
    } else if (fieldName === 'daily_calories') {
        const newMacros = AppState.calculateMacrosFromCalories(
            numericValue,
            currentGoals.protein_target,
            currentGoals.carbs_target,
            currentGoals.fat_target
        );
        
        updatedGoals.protein_target = Math.round(newMacros.protein);
        updatedGoals.carbs_target = Math.round(newMacros.carbs);
        updatedGoals.fat_target = Math.round(newMacros.fat);
        
        updateMacroKnobs(numericValue);
    }
    
    AppState.setGoals(updatedGoals);
}
