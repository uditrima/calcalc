// Update handlers for dashboard components
/**
 * Updates macros gauges (currently not used in new design)
 * @param {Object} state - The current app state
 */
export function updateMacrosGauges(state) {
    // This function is no longer needed as we removed the macros section
    // The new design focuses on calories, steps, and exercise
    // Macros can be added back later if needed
}

/**
 * Updates a small gauge component
 * @param {string} type - The gauge type
 * @param {number} current - Current value
 * @param {number} target - Target value
 */
export function updateSmallGauge(type, current, target) {
    const percentage = Math.min((current / target) * 100, 100);
    const progressCircle = document.querySelector(`.${type}-progress`);
    const text = document.querySelector(`.${type}-text`);
    
    if (progressCircle) {
        const circumference = 188.4;
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.setAttribute('stroke-dashoffset', offset);
    }
    
    if (text) text.textContent = `${Math.round(current)}g`;
}

/**
 * Updates the exercise display with current state data
 * @param {Object} state - The current app state
 */
export function updateExerciseDisplay(state) {
    const exercises = state.exercises;
    
    // Update exercise stats if they exist
    const exerciseStats = document.querySelectorAll('.exercise-stat');
    if (exerciseStats.length >= 2) {
        const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration_minutes || 0), 0);
        
        // Update calories
        const caloriesElement = exerciseStats[0].querySelector('.number');
        if (caloriesElement) {
            caloriesElement.textContent = Math.round(totalCalories);
        }
        
        // Update duration
        const durationElement = exerciseStats[1].querySelector('.number');
        if (durationElement) {
            const hours = Math.floor(totalDuration / 60);
            const minutes = totalDuration % 60;
            durationElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
        }
    }
}

/**
 * Updates the weight display with current state data
 * @param {Object} state - The current app state
 */
export function updateWeightDisplay(state) {
    const weights = state.weights;
    
    // Update weight chart if it exists
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer && weights.length > 0) {
        // Update chart with real data
        const latest = weights[0];
        const chartPoint = chartContainer.querySelector('.chart-point');
        if (chartPoint) {
            // Calculate position based on weight value
            const minWeight = 70;
            const maxWeight = 120;
            const weight = latest.weight_kg;
            const percentage = Math.max(0, Math.min(100, ((weight - minWeight) / (maxWeight - minWeight)) * 100));
            chartPoint.style.top = `${100 - percentage}%`;
        }
    }
}
