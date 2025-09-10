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
    section.className = 'calories-card';
    
    // Card header
    const header = document.createElement('div');
    header.className = 'card-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Kalorier';
    header.appendChild(title);
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.innerHTML = '✏️';
    header.appendChild(editBtn);
    
    section.appendChild(header);
    
    // Formula text
    const formula = document.createElement('div');
    formula.className = 'formula-text';
    formula.textContent = 'Resterende = Mål - Mad + Motion';
    section.appendChild(formula);
    
    // Gauge container
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
    
    // Progress circle (blue)
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '100');
    progressCircle.setAttribute('cy', '100');
    progressCircle.setAttribute('r', '80');
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', '#007AFF');
    progressCircle.setAttribute('stroke-width', '20');
    progressCircle.setAttribute('stroke-dasharray', '502.4');
    progressCircle.setAttribute('stroke-dashoffset', '502.4');
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('transform', 'rotate(-90 100 100)');
    progressCircle.setAttribute('class', 'calories-progress');
    svg.appendChild(progressCircle);
    
    // Remaining circle (orange)
    const remainingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    remainingCircle.setAttribute('cx', '100');
    remainingCircle.setAttribute('cy', '100');
    remainingCircle.setAttribute('r', '80');
    remainingCircle.setAttribute('fill', 'none');
    remainingCircle.setAttribute('stroke', '#FF9500');
    remainingCircle.setAttribute('stroke-width', '20');
    remainingCircle.setAttribute('stroke-dasharray', '502.4');
    remainingCircle.setAttribute('stroke-dashoffset', '502.4');
    remainingCircle.setAttribute('stroke-linecap', 'round');
    remainingCircle.setAttribute('transform', 'rotate(-90 100 100)');
    remainingCircle.setAttribute('class', 'calories-remaining');
    svg.appendChild(remainingCircle);
    
    // Center text
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    textGroup.setAttribute('text-anchor', 'middle');
    
    const remainingText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    remainingText.setAttribute('x', '100');
    remainingText.setAttribute('y', '90');
    remainingText.setAttribute('font-size', '32');
    remainingText.setAttribute('font-weight', 'bold');
    remainingText.setAttribute('fill', '#fff');
    remainingText.setAttribute('class', 'calories-remaining-text');
    remainingText.textContent = '288';
    textGroup.appendChild(remainingText);
    
    const remainingLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    remainingLabel.setAttribute('x', '100');
    remainingLabel.setAttribute('y', '115');
    remainingLabel.setAttribute('font-size', '16');
    remainingLabel.setAttribute('fill', '#888');
    remainingLabel.textContent = 'Resterende';
    textGroup.appendChild(remainingLabel);
    
    svg.appendChild(textGroup);
    gaugeContainer.appendChild(svg);
    
    // Stats on the right
    const statsContainer = document.createElement('div');
    statsContainer.className = 'calories-stats';
    
    const baseGoal = createStatItem('🏁', 'Base Mål', '1,500');
    const food = createStatItem('🍴', 'Mad', '1,712');
    const exercise = createStatItem('🔥', 'Motion', '500');
    
    statsContainer.appendChild(baseGoal);
    statsContainer.appendChild(food);
    statsContainer.appendChild(exercise);
    
    gaugeContainer.appendChild(statsContainer);
    section.appendChild(gaugeContainer);
    
    // Page dots
    const dots = document.createElement('div');
    dots.className = 'page-dots';
    dots.innerHTML = '● ○ ○ ○ ○';
    section.appendChild(dots);
    
    return section;
}

function createStatItem(icon, label, value) {
    const item = document.createElement('div');
    item.className = 'stat-item';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'stat-icon';
    iconSpan.textContent = icon;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'stat-text';
    textSpan.innerHTML = `<strong>${value}</strong><br>${label}`;
    
    item.appendChild(iconSpan);
    item.appendChild(textSpan);
    return item;
}

function createMacrosSection() {
    const section = document.createElement('div');
    section.className = 'stats-row';
    
    // Steps card
    const stepsCard = createStepsCard();
    section.appendChild(stepsCard);
    
    // Exercise card
    const exerciseCard = createExerciseCard();
    section.appendChild(exerciseCard);
    
    return section;
}

function createStepsCard() {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    const title = document.createElement('h3');
    title.textContent = 'Skridt';
    card.appendChild(title);
    
    const content = document.createElement('div');
    content.className = 'stat-content';
    
    const icon = document.createElement('div');
    icon.className = 'stat-icon-large';
    icon.innerHTML = '👟';
    
    const value = document.createElement('div');
    value.className = 'stat-value';
    value.innerHTML = '<span class="number">0</span>';
    
    const goal = document.createElement('div');
    goal.className = 'stat-goal';
    goal.textContent = 'Mål: 10,000 skridt';
    
    content.appendChild(icon);
    content.appendChild(value);
    content.appendChild(goal);
    
    card.appendChild(content);
    return card;
}

function createExerciseCard() {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    const header = document.createElement('div');
    header.className = 'card-header';
    
    const title = document.createElement('h3');
    title.textContent = 'Motion';
    header.appendChild(title);
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add';
    addBtn.innerHTML = '+';
    header.appendChild(addBtn);
    
    card.appendChild(header);
    
    const content = document.createElement('div');
    content.className = 'stat-content';
    
    const calories = document.createElement('div');
    calories.className = 'exercise-stat';
    calories.innerHTML = '🔥 <span class="number">500</span> cal';
    
    const duration = document.createElement('div');
    duration.className = 'exercise-stat';
    duration.innerHTML = '🕐 <span class="number">0:24</span> hr';
    
    content.appendChild(calories);
    content.appendChild(duration);
    
    card.appendChild(content);
    return card;
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
    progressCircle.setAttribute('class', `${name.toLowerCase()}-progress`);
    svg.appendChild(progressCircle);
    
    // Center text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '40');
    text.setAttribute('y', '45');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#fff');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', `${name.toLowerCase()}-text`);
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
    section.className = 'weight-card';
    
    const header = document.createElement('div');
    header.className = 'card-header';
    
    const title = document.createElement('h3');
    title.textContent = 'Vægt';
    header.appendChild(title);
    
    const subtitle = document.createElement('div');
    subtitle.className = 'card-subtitle';
    subtitle.textContent = 'Sidste 90 dage';
    header.appendChild(subtitle);
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add';
    addBtn.innerHTML = '+';
    header.appendChild(addBtn);
    
    section.appendChild(header);
    
    // Weight chart placeholder
    const chart = document.createElement('div');
    chart.className = 'weight-chart';
    chart.innerHTML = `
        <div class="chart-container">
            <div class="chart-lines">
                <div class="weight-line" style="top: 20%;"></div>
                <div class="weight-line" style="top: 80%;"></div>
            </div>
            <div class="chart-point" style="top: 20%; right: 10px;"></div>
        </div>
        <div class="chart-labels">
            <div class="y-labels">
                <span>118</span>
                <span>104</span>
                <span>91</span>
                <span>77</span>
            </div>
            <div class="x-labels">
                <span>06/12</span>
                <span>07/12</span>
                <span>08/11</span>
                <span>09/10</span>
            </div>
        </div>
    `;
    
    section.appendChild(chart);
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
