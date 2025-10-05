// SVG creation for calories gauge component
import { AppState } from '../../state/app_state.js';

/**
 * Creates the calories gauge section with SVG progress circles
 * @returns {HTMLElement} The calories gauge section element
 */
export function createCaloriesGauge() {
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
    
    const svg = createCaloriesSVG();
    gaugeContainer.appendChild(svg);
    
    // Stats on the right
    const statsContainer = document.createElement('div');
    statsContainer.className = 'calories-stats';
    
    // Get goals data or use default
    const formattedGoals = AppState.getFormattedGoals();
    const baseGoal = createStatItem('🏁', 'Base Mål', formattedGoals?.calories.formatted || '1,500');
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

/**
 * Creates the SVG element for the calories gauge
 * @returns {SVGElement} The SVG element
 */
function createCaloriesSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '150');
    svg.setAttribute('height', '150');
    svg.setAttribute('viewBox', '0 0 200 200');
    
    // Goal circle (mørk baggrund for hele målet)
    const goalCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    goalCircle.setAttribute('cx', '100');
    goalCircle.setAttribute('cy', '100');
    goalCircle.setAttribute('r', '80');
    goalCircle.setAttribute('fill', 'none');
    goalCircle.setAttribute('stroke', '#161726');
    goalCircle.setAttribute('stroke-dasharray', '502.4');
    goalCircle.setAttribute('stroke-dashoffset', '0');
    goalCircle.setAttribute('stroke-linecap', 'round');
    goalCircle.setAttribute('transform', 'rotate(-90 100 100)');
    goalCircle.setAttribute('class', 'calories-goal');
    svg.appendChild(goalCircle);
    
    // Progress circle (kalorie farve for indtaget mad) - 360 grader hvis indtaget = mål
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', '100');
    progressCircle.setAttribute('cy', '100');
    progressCircle.setAttribute('r', '80');
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', '#7abcfb'); // Direkte farve i stedet for CSS variabel
    progressCircle.setAttribute('stroke-dasharray', '502.4');
    progressCircle.setAttribute('stroke-dashoffset', '502.4');
    progressCircle.setAttribute('stroke-linecap', 'butt'); // Skarp ende
    progressCircle.setAttribute('transform', 'rotate(-90 100 100)');
    progressCircle.setAttribute('class', 'calories-progress');
    svg.appendChild(progressCircle);
    
    // Opret en lille cirkel for den runde ende
    const progressEndCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressEndCircle.setAttribute('cx', '100');
    progressEndCircle.setAttribute('cy', '100');
    progressEndCircle.setAttribute('r', '80');
    progressEndCircle.setAttribute('fill', 'none');
    progressEndCircle.setAttribute('stroke', '#7abcfb');
    progressEndCircle.setAttribute('stroke-width', '12');
    progressEndCircle.setAttribute('stroke-dasharray', '0, 502.4'); // Kun vis den runde ende
    progressEndCircle.setAttribute('stroke-dashoffset', '502.4');
    progressEndCircle.setAttribute('stroke-linecap', 'round'); // Rund ende
    progressEndCircle.setAttribute('transform', 'rotate(-90 100 100)');
    progressEndCircle.setAttribute('class', 'calories-progress-end');
    svg.appendChild(progressEndCircle);
    
    // Hovedcirkel for motion/øvelse kalorier (skarp ende)
    const exerciseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    exerciseCircle.setAttribute('cx', '100');
    exerciseCircle.setAttribute('cy', '100');
    exerciseCircle.setAttribute('r', '65'); // Mindre radius for at være inden i hovedcirklen
    exerciseCircle.setAttribute('fill', 'none');
    exerciseCircle.setAttribute('stroke', '#ff6b6b'); // Rød farve for motion
    exerciseCircle.setAttribute('stroke-width', '8');
    exerciseCircle.setAttribute('stroke-dasharray', '408.2'); // Omkreds for r=65
    exerciseCircle.setAttribute('stroke-dashoffset', '408.2');
    exerciseCircle.setAttribute('stroke-linecap', 'butt'); // Skarp ende
    exerciseCircle.setAttribute('transform', 'rotate(90 100 100) scale(-1, 1) translate(-200 0)');
    exerciseCircle.setAttribute('class', 'exercise-progress');
    svg.appendChild(exerciseCircle);
    
    // Ende-cirkel for motion/øvelse kalorier (rund ende)
    const exerciseEndCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    exerciseEndCircle.setAttribute('cx', '100');
    exerciseEndCircle.setAttribute('cy', '100');
    exerciseEndCircle.setAttribute('r', '65');
    exerciseEndCircle.setAttribute('fill', 'none');
    exerciseEndCircle.setAttribute('stroke', '#ff6b6b');
    exerciseEndCircle.setAttribute('stroke-width', '8');
    exerciseEndCircle.setAttribute('stroke-dasharray', '0, 408.2'); // Kun vis den runde ende
    exerciseEndCircle.setAttribute('stroke-dashoffset', '408.2');
    exerciseEndCircle.setAttribute('stroke-linecap', 'round'); // Rund ende
    exerciseEndCircle.setAttribute('transform', 'rotate(90 100 100) scale(-1, 1) translate(-200 0)');
    exerciseEndCircle.setAttribute('class', 'exercise-progress-end');
    svg.appendChild(exerciseEndCircle);
    
    // Center text
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    textGroup.setAttribute('text-anchor', 'middle');
    
    const remainingText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    remainingText.setAttribute('x', '100');
    remainingText.setAttribute('y', '90');
    remainingText.setAttribute('font-size', '24');
    remainingText.setAttribute('font-weight', 'bold');
    remainingText.setAttribute('fill', '#fff');
    remainingText.setAttribute('class', 'calories-remaining-text');
    remainingText.textContent = '288';
    textGroup.appendChild(remainingText);
    
    const remainingLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    remainingLabel.setAttribute('x', '100');
    remainingLabel.setAttribute('y', '115');
    remainingLabel.setAttribute('font-size', '12');
    remainingLabel.setAttribute('fill', '#888');
    remainingLabel.textContent = 'Resterende';
    textGroup.appendChild(remainingLabel);
    
    svg.appendChild(textGroup);
    return svg;
}

/**
 * Creates a stat item element
 * @param {string} icon - The icon emoji
 * @param {string} label - The label text
 * @param {string} value - The value text
 * @returns {HTMLElement} The stat item element
 */
function createStatItem(icon, label, value) {
    const item = document.createElement('div');
    item.className = 'stat-item';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'stat-icon';
    iconSpan.textContent = icon;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'stat-text';
    textSpan.innerHTML = `${label} <strong>${value}</strong>`;
    
    item.appendChild(iconSpan);
    item.appendChild(textSpan);
    return item;
}
