// Dashboard UI component
import { AppState } from '../state/app_state.js';

export function Dashboard(container) {
    console.log('Dashboard component called with container:', container);
    
    if (!container) {
        throw new Error('Dashboard requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create dashboard structure
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';
    console.log('Dashboard element created:', dashboard);
    
    // Main calories gauge
    const caloriesSection = createCaloriesGauge();
    dashboard.appendChild(caloriesSection);
    
    // Macros section
    const macrosSection = createMacrosSection();
    dashboard.appendChild(macrosSection);
    
    // Exercise section
    const exerciseSection = createExerciseSection();
    dashboard.appendChild(exerciseSection);
    
    // Weight section
    const weightSection = createWeightSection();
    dashboard.appendChild(weightSection);
    
    // Add to container
    container.appendChild(dashboard);
    console.log('Dashboard added to container');
    
    // Subscribe to state changes
    AppState.subscribe('diary', updateDashboard);
    AppState.subscribe('exercises', updateDashboard);
    AppState.subscribe('weights', updateDashboard);
    AppState.subscribe('goals', updateDashboard);
    console.log('Dashboard subscribed to state changes');
    
    // Initial update
    updateDashboard();
    console.log('Dashboard initial update completed');
    
    function updateDashboard() {
        const state = AppState.getState();
        console.log('Dashboard updating with state:', state);
        updateCaloriesGauge(state);
        updateMacrosGauges(state);
        updateExerciseDisplay(state);
        updateWeightDisplay(state);
    }
    
    // Return the dashboard element for external access
    console.log('Dashboard returning element:', dashboard);
    return dashboard;
}

function createCaloriesGauge() {
    const section = document.createElement('div');
    section.className = 'calories-gauge';
    
    const title = document.createElement('h2');
    title.textContent = 'Dagens Kalorier';
    section.appendChild(title);
    
    const gaugeContainer = document.createElement('div');
    gaugeContainer.className = 'gauge-container';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', '0 0 200 200');
    
    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '100');
    bgCircle.setAttribute('cy', '100');
    bgCircle.setAttribute('r', '80');
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#333');
    bgCircle.setAttribute('stroke-width', '20');
    svg.appendChild(bgCircle);
    
    // Progress circle
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '100');
    progressCircle.setAttribute('cy', '100');
    progressCircle.setAttribute('r', '80');
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', '#00ff88');
    progressCircle.setAttribute('stroke-width', '20');
    progressCircle.setAttribute('stroke-dasharray', '502.4');
    progressCircle.setAttribute('stroke-dashoffset', '502.4');
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('transform', 'rotate(-90 100 100)');
    progressCircle.className = 'calories-progress';
    svg.appendChild(progressCircle);
    
    // Center text
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    textGroup.setAttribute('text-anchor', 'middle');
    
    const currentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    currentText.setAttribute('x', '100');
    currentText.setAttribute('y', '90');
    currentText.setAttribute('font-size', '24');
    currentText.setAttribute('fill', '#fff');
    currentText.className = 'calories-current';
    currentText.textContent = '0';
    textGroup.appendChild(currentText);
    
    const targetText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    targetText.setAttribute('x', '100');
    targetText.setAttribute('y', '115');
    targetText.setAttribute('font-size', '16');
    targetText.setAttribute('fill', '#888');
    targetText.className = 'calories-target';
    targetText.textContent = 'af 2000';
    textGroup.appendChild(targetText);
    
    svg.appendChild(textGroup);
    gaugeContainer.appendChild(svg);
    section.appendChild(gaugeContainer);
    
    return section;
}

function createMacrosSection() {
    const section = document.createElement('div');
    section.className = 'macros-section';
    
    const title = document.createElement('h3');
    title.textContent = 'Makronæringsstoffer';
    section.appendChild(title);
    
    const macrosContainer = document.createElement('div');
    macrosContainer.className = 'macros-container';
    
    // Protein
    const proteinGauge = createSmallGauge('Protein', '#ff6b6b');
    macrosContainer.appendChild(proteinGauge);
    
    // Carbs
    const carbsGauge = createSmallGauge('Kulhydrater', '#4ecdc4');
    macrosContainer.appendChild(carbsGauge);
    
    // Fat
    const fatGauge = createSmallGauge('Fedt', '#ffe66d');
    macrosContainer.appendChild(fatGauge);
    
    section.appendChild(macrosContainer);
    return section;
}

function createSmallGauge(name, color) {
    const gauge = document.createElement('div');
    gauge.className = 'small-gauge';
    
    const title = document.createElement('div');
    title.className = 'gauge-title';
    title.textContent = name;
    gauge.appendChild(title);
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    svg.setAttribute('viewBox', '0 0 80 80');
    
    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '40');
    bgCircle.setAttribute('cy', '40');
    bgCircle.setAttribute('r', '30');
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#333');
    bgCircle.setAttribute('stroke-width', '6');
    svg.appendChild(bgCircle);
    
    // Progress circle
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '40');
    progressCircle.setAttribute('cy', '40');
    progressCircle.setAttribute('r', '30');
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', color);
    progressCircle.setAttribute('stroke-width', '6');
    progressCircle.setAttribute('stroke-dasharray', '188.4');
    progressCircle.setAttribute('stroke-dashoffset', '188.4');
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('transform', 'rotate(-90 40 40)');
    progressCircle.className = `${name.toLowerCase()}-progress`;
    svg.appendChild(progressCircle);
    
    // Center text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '40');
    text.setAttribute('y', '45');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#fff');
    text.setAttribute('text-anchor', 'middle');
    text.className = `${name.toLowerCase()}-text`;
    text.textContent = '0g';
    svg.appendChild(text);
    
    gauge.appendChild(svg);
    return gauge;
}

function createExerciseSection() {
    const section = document.createElement('div');
    section.className = 'exercise-section';
    
    const title = document.createElement('h3');
    title.textContent = 'Motion i dag';
    section.appendChild(title);
    
    const exerciseDisplay = document.createElement('div');
    exerciseDisplay.className = 'exercise-display';
    exerciseDisplay.innerHTML = '<p>Ingen øvelser registreret i dag</p>';
    
    section.appendChild(exerciseDisplay);
    return section;
}

function createWeightSection() {
    const section = document.createElement('div');
    section.className = 'weight-section';
    
    const title = document.createElement('h3');
    title.textContent = 'Vægt';
    section.appendChild(title);
    
    const weightDisplay = document.createElement('div');
    weightDisplay.className = 'weight-display';
    weightDisplay.innerHTML = '<p>Ingen vægtmålinger</p>';
    
    section.appendChild(weightDisplay);
    return section;
}

function updateCaloriesGauge(state) {
    const current = state.diary.entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const target = state.goals.daily_calories || 2000;
    const percentage = Math.min((current / target) * 100, 100);
    
    const progressCircle = document.querySelector('.calories-progress');
    const currentText = document.querySelector('.calories-current');
    const targetText = document.querySelector('.calories-target');
    
    if (progressCircle) {
        const circumference = 502.4;
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.setAttribute('stroke-dashoffset', offset);
    }
    
    if (currentText) currentText.textContent = Math.round(current);
    if (targetText) targetText.textContent = `af ${target}`;
}

function updateMacrosGauges(state) {
    const entries = state.diary.entries;
    const goals = state.goals;
    
    // Calculate totals
    const totals = entries.reduce((acc, entry) => {
        acc.protein += entry.protein || 0;
        acc.carbs += entry.carbohydrates || 0;
        acc.fat += entry.fat || 0;
        return acc;
    }, { protein: 0, carbs: 0, fat: 0 });
    
    // Update protein
    updateSmallGauge('protein', totals.protein, goals.protein_target || 150);
    // Update carbs
    updateSmallGauge('carbs', totals.carbs, goals.carbs_target || 250);
    // Update fat
    updateSmallGauge('fat', totals.fat, goals.fat_target || 70);
}

function updateSmallGauge(type, current, target) {
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

function updateExerciseDisplay(state) {
    const exercises = state.exercises;
    const display = document.querySelector('.exercise-display');
    
    if (exercises.length === 0) {
        display.innerHTML = '<p>Ingen øvelser registreret i dag</p>';
    } else {
        const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        display.innerHTML = `
            <p><strong>${exercises.length}</strong> øvelser</p>
            <p><strong>${Math.round(totalCalories)}</strong> kalorier forbrændt</p>
        `;
    }
}

function updateWeightDisplay(state) {
    const weights = state.weights;
    const display = document.querySelector('.weight-display');
    
    if (weights.length === 0) {
        display.innerHTML = '<p>Ingen vægtmålinger</p>';
    } else {
        const latest = weights[0]; // Assuming sorted by date desc
        display.innerHTML = `
            <p><strong>${latest.weight_kg} kg</strong></p>
            <p>${new Date(latest.date).toLocaleDateString()}</p>
        `;
    }
}
