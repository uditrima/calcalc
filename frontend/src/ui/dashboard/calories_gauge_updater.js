// Update logic for calories gauge component
/**
 * Updates the calories gauge with current state data
 * @param {Object} state - The current app state
 */
export function updateCaloriesGauge(state) {
    const current = state.diary.entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const target = state.goals.daily_calories || 2000;
    const exerciseCalories = state.exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
    const remaining = target - current + exerciseCalories; // Formel: Mål - Mad + Motion
    
    // Beregn faktisk brugte kalorier (mad minus motion)
    const netCalories = Math.max(0, current - exerciseCalories);
    const usedPercentage = Math.min((netCalories / target) * 100, 100);
    
    // Shallow comparison to prevent unnecessary updates
    const currentData = { current, target, exerciseCalories, netCalories, remaining, usedPercentage };
    if (updateCaloriesGauge._lastData && 
        updateCaloriesGauge._lastData.current === currentData.current &&
        updateCaloriesGauge._lastData.target === currentData.target &&
        updateCaloriesGauge._lastData.exerciseCalories === currentData.exerciseCalories) {
        console.log('updateCaloriesGauge: Data unchanged, skipping DOM update');
        return;
    }
    updateCaloriesGauge._lastData = currentData;
    
    console.log('updateCaloriesGauge - current:', current, 'target:', target, 'exerciseCalories:', exerciseCalories, 'netCalories:', netCalories, 'remaining:', remaining, 'usedPercentage:', usedPercentage);
    
    updateProgressCircles(usedPercentage, exerciseCalories, target);
    updateRemainingText(remaining);
    updateStats(state, current, target, exerciseCalories);
}

/**
 * Updates the progress circles in the SVG
 * @param {number} usedPercentage - Percentage of calories used
 * @param {number} exerciseCalories - Calories burned from exercise
 * @param {number} target - Target calories
 */
function updateProgressCircles(usedPercentage, exerciseCalories, target) {
    const progressCircle = document.querySelector('.calories-progress');
    const progressEndCircle = document.querySelector('.calories-progress-end');
    
    console.log('Found elements - progressCircle:', progressCircle, 'progressEndCircle:', progressEndCircle);
    
    if (progressCircle) {
        const circumference = 502.4;
        const usedOffset = circumference - (usedPercentage / 100) * circumference;
        console.log('Setting progressCircle stroke-dashoffset to:', usedOffset);
        
        // Sæt alle attributter eksplicit for hovedcirklen (skarp ende)
        progressCircle.setAttribute('stroke', '#7abcfb');
        progressCircle.setAttribute('stroke-width', '12');
        progressCircle.setAttribute('stroke-dasharray', '502.4');
        progressCircle.setAttribute('stroke-dashoffset', usedOffset);
        progressCircle.setAttribute('stroke-linecap', 'butt');
        
        console.log('Progress circle attributes set:', {
            stroke: progressCircle.getAttribute('stroke'),
            strokeWidth: progressCircle.getAttribute('stroke-width'),
            strokeDasharray: progressCircle.getAttribute('stroke-dasharray'),
            strokeDashoffset: progressCircle.getAttribute('stroke-dashoffset')
        });
    }
    
    if (progressEndCircle) {
        const circumference = 502.4;
        const usedOffset = circumference - (usedPercentage / 100) * circumference;
        
        // Sæt attributter for ende-cirklen (rund ende)
        progressEndCircle.setAttribute('stroke', '#7abcfb');
        progressEndCircle.setAttribute('stroke-width', '12');
        progressEndCircle.setAttribute('stroke-dasharray', '0, 502.4'); // Kun vis den runde ende
        progressEndCircle.setAttribute('stroke-dashoffset', usedOffset);
        progressEndCircle.setAttribute('stroke-linecap', 'round');
        
        console.log('Progress end circle attributes set');
    }
    
    // Opdater motion cirkler
    updateExerciseCircles(exerciseCalories, target);
}

/**
 * Updates the exercise circles in the SVG
 * @param {number} exerciseCalories - Calories burned from exercise
 * @param {number} target - Target calories
 */
function updateExerciseCircles(exerciseCalories, target) {
    const exerciseCircle = document.querySelector('.exercise-progress');
    const exerciseEndCircle = document.querySelector('.exercise-progress-end');
    
    if (exerciseCircle && exerciseEndCircle) {
        const exercisePercentage = Math.min((exerciseCalories / target) * 100, 100);
        const exerciseCircumference = 408.2; // Omkreds for r=65
        const exerciseOffset = exerciseCircumference - (exercisePercentage / 100) * exerciseCircumference;
        
        // Hovedcirkel (skarp ende)
        exerciseCircle.setAttribute('stroke', '#ff6b6b');
        exerciseCircle.setAttribute('stroke-width', '8');
        exerciseCircle.setAttribute('stroke-dasharray', '408.2');
        exerciseCircle.setAttribute('stroke-dashoffset', exerciseOffset);
        exerciseCircle.setAttribute('stroke-linecap', 'butt');
        
        // Ende-cirkel (rund ende)
        exerciseEndCircle.setAttribute('stroke', '#ff6b6b');
        exerciseEndCircle.setAttribute('stroke-width', '8');
        exerciseEndCircle.setAttribute('stroke-dasharray', '0, 408.2'); // Kun vis den runde ende
        exerciseEndCircle.setAttribute('stroke-dashoffset', exerciseOffset);
        exerciseEndCircle.setAttribute('stroke-linecap', 'round');
        
        console.log('Exercise circles updated:', { exercisePercentage, exerciseOffset });
    }
}

/**
 * Updates the remaining calories text
 * @param {number} remaining - Remaining calories
 */
function updateRemainingText(remaining) {
    const remainingText = document.querySelector('.calories-remaining-text');
    
    if (remainingText) {
        remainingText.textContent = Math.round(remaining);
        
        // Style text based on remaining calories
        if (remaining < 0) {
            remainingText.classList.add('negative-calories');
        } else {
            remainingText.classList.remove('negative-calories');
        }
    }
}

/**
 * Updates the stats section
 * @param {Object} state - The current app state
 * @param {number} current - Current calories consumed
 * @param {number} target - Target calories
 * @param {number} exerciseCalories - Calories burned from exercise
 */
function updateStats(state, current, target, exerciseCalories) {
    // Update stats
    const statItems = document.querySelectorAll('.stat-text');
    if (statItems.length >= 3) {
        // Update base goal
        statItems[0].innerHTML = `Base Mål <strong>${target}</strong>`;
        // Update food
        statItems[1].innerHTML = `Mad <strong>${Math.round(current)}</strong>`;
        // Update exercise
        const exerciseCalories = state.exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        statItems[2].innerHTML = `Motion <strong>${Math.round(exerciseCalories)}</strong>`;
    }
}
