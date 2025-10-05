// Nutrition Goals Knob Drag Handler
// Handles drag/drop interactions for rotary knobs

import { KNOB_RANGES } from '../nutrition_goals_constants.js';
import { parseNumeric } from '../nutrition_goals_formatters.js';

export function createKnobDragHandler(knob, label, updateKnobValue) {
    let isDragging = false;
    let startX = 0;
    let startValue = 0;
    let currentValue = 0;
    
    const range = KNOB_RANGES[label] || { min: 0, max: 1000, step: 1 };
    
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
    
    // Mouse events
    knob.addEventListener('mousedown', startDragWithGlobalListeners);
    
    // Touch events
    knob.addEventListener('touchstart', startDragWithGlobalListeners, { passive: false });
    
    // Initialize with current value
    const knobValue = knob.getAttribute('data-value');
    const initialValue = parseNumeric(knobValue) || range.min;
    currentValue = initialValue;
    knob._currentValue = currentValue;
    
    // Return function to update current value
    return (newValue) => {
        currentValue = newValue;
    };
}
