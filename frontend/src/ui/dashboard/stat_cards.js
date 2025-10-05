// Stat cards components for dashboard
/**
 * Creates the macros section with steps and exercise cards
 * @returns {HTMLElement} The macros section element
 */
export function createMacrosSection() {
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

/**
 * Creates the steps card component
 * @returns {HTMLElement} The steps card element
 */
export function createStepsCard() {
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

/**
 * Creates the exercise card component
 * @returns {HTMLElement} The exercise card element
 */
export function createExerciseCard() {
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

/**
 * Creates a small gauge component
 * @param {string} name - The gauge name
 * @param {string} color - The gauge color
 * @returns {HTMLElement} The gauge element
 */
export function createSmallGauge(name, color) {
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
