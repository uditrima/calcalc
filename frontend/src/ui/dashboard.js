// Dashboard UI component
import { AppState } from '../state/app_state.js';
import { ApiClient } from '../data/api.js';
const api = new ApiClient();


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
    
    // Create custom scrollbar for the dashboard container
    createCustomScrollbar(dashboard);
    
    // Dashboard loads its own data independently to always show today's data
    console.log('Dashboard will load today\'s data independently');
    
    // Initial update - kald efter DOM elementer er tilføjet
    setTimeout(() => {
        updateDashboard();
        console.log('Dashboard initial update completed');
    }, 0);
    
    // Listen for goals changes to update dashboard automatically
    const handleGoalsChange = () => {
        console.log('Goals changed, updating dashboard');
        updateDashboard();
    };
    
    // Listen for goals committed event to refresh data
    const handleGoalsCommitted = async () => {
        console.log('Goals committed, refreshing dashboard data...');
        // Reload goals to ensure we have the latest data
        await AppState.loadGoals();
        // Update dashboard with fresh data
        updateDashboard();
    };
    
    // Subscribe to goals changes in AppState
    AppState.subscribe('goals', handleGoalsChange);
    
    // Add event listener for goals committed
    window.addEventListener('goalsCommitted', handleGoalsCommitted);
    
    // Return cleanup function
    return () => {
        AppState.unsubscribe('goals', handleGoalsChange);
        window.removeEventListener('goalsCommitted', handleGoalsCommitted);
    };
    
    function updateDashboard() {
        // Dashboard should always show today's data, not the selected date from diary
        const today = new Date().toISOString().split('T')[0];
        console.log('Dashboard updating with today\'s data:', today);
        
        // Load today's data specifically for dashboard
        loadTodaysDataForDashboard(today);
    }
    
    async function loadTodaysDataForDashboard(today) {
        try {
            // Load today's diary entries
            const diaryData = await api.getDiaryEntries(today);
            
            // Load today's exercises
            const exerciseData = await api.getExercises(today);
            
            // Get goals (these don't change by date)
            const state = AppState.getState();
            
            // Create today's state for dashboard
            const todaysState = {
                diary: { date: today, entries: Array.isArray(diaryData) ? diaryData : [] },
                exercises: Array.isArray(exerciseData) ? exerciseData : [],
                goals: state.goals,
                weights: state.weights
            };
            
            console.log('Dashboard updating with today\'s state:', todaysState);
            updateCaloriesGauge(todaysState);
            updateMacrosGauges(todaysState);
            updateExerciseDisplay(todaysState);
            updateWeightDisplay(todaysState);
        } catch (error) {
            console.error('Error loading today\'s data for dashboard:', error);
            // Fallback to current state
            const state = AppState.getState();
            updateCaloriesGauge(state);
            updateMacrosGauges(state);
            updateExerciseDisplay(state);
            updateWeightDisplay(state);
        }
    }
    
    function updateCaloriesGauge(state) {
        const current = state.diary.entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        const target = state.goals.daily_calories || 2000;
        const exerciseCalories = state.exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);
        const remaining = target - current + exerciseCalories; // Formel: Mål - Mad + Motion
        
        // Beregn faktisk brugte kalorier (mad minus motion)
        const netCalories = Math.max(0, current - exerciseCalories);
        const usedPercentage = Math.min((netCalories / target) * 100, 100);
        
        console.log('updateCaloriesGauge - current:', current, 'target:', target, 'exerciseCalories:', exerciseCalories, 'netCalories:', netCalories, 'remaining:', remaining, 'usedPercentage:', usedPercentage);
        
        const progressCircle = document.querySelector('.calories-progress');
        const progressEndCircle = document.querySelector('.calories-progress-end');
        const remainingText = document.querySelector('.calories-remaining-text');
        
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
        
        
        if (remainingText) {
            remainingText.textContent = Math.max(0, Math.round(remaining));
        }
        
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
    
    // Return the dashboard element for external access
    console.log('Dashboard returning element:', dashboard);
    function createCustomScrollbar(container) {
        console.log('Creating custom scrollbar for container:', container);
        
        // Color interpolation function
        function interpolateColor(color1, color2, ratio) {
            // Convert hex to RGB
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            
            const rgb1 = hexToRgb(color1);
            const rgb2 = hexToRgb(color2);
            
            if (!rgb1 || !rgb2) return color1;
            
            const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
            const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
            const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
            
            return `rgb(${r}, ${g}, ${b})`;
        }
        
        // Hide native scrollbar
        container.style.scrollbarWidth = 'none';
        container.style.msOverflowStyle = 'none';
        const style = document.createElement('style');
        style.textContent = `
            ${container.tagName.toLowerCase()}::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        // Create scrollbar track
        const scrollbar = document.createElement('div');
        scrollbar.className = 'custom-scrollbar';
        
        // Create scrollbar thumb
        const thumb = document.createElement('div');
        thumb.className = 'custom-scrollbar-thumb';
        scrollbar.appendChild(thumb);
        
        // Add scrollbar to container
        container.appendChild(scrollbar);
        
        // Update scrollbar on scroll
        function updateScrollbar() {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            
            console.log('Updating scrollbar:', { scrollTop, scrollHeight, clientHeight });
            
            // Always show scrollbar for testing
            scrollbar.style.display = 'block';
            
            if (scrollHeight <= clientHeight) {
                // If no scrolling needed, hide scrollbar
                scrollbar.style.display = 'none';
                return;
            }
            
            const scrollbarHeight = scrollbar.getBoundingClientRect().height;
            const thumbHeight = scrollbarHeight * 0.07; // Always 7% of scrollbar height
            const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
            
            // Calculate color based on position (0 = top, 1 = bottom)
            const positionRatio = thumbTop / (scrollbarHeight - thumbHeight);
            const color = interpolateColor('#46ae98', '#ae7246', positionRatio);
            
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.top = `${thumbTop}px`;
            thumb.style.background = color;
        }
        
        // Add scroll listener
        container.addEventListener('scroll', () => {
            console.log('Container scrolled, updating scrollbar');
            updateScrollbar();
        });
        
        // Add click event listener to scrollbar track
        scrollbar.addEventListener('click', (e) => {
            console.log('Scrollbar track clicked');
            const rect = scrollbar.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const percentage = clickY / rect.height;
            const scrollTop = percentage * (container.scrollHeight - container.clientHeight);
            console.log('Scrolling to:', scrollTop);
            container.scrollTop = scrollTop;
        });
        
        // Add click event listener to scrollbar thumb
        thumb.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent track click
        });
        
        // Add drag functionality to thumb
        let isDragging = false;
        let startY = 0;
        let startScrollTop = 0;
        
        thumb.addEventListener('mousedown', (e) => {
            console.log('Thumb mousedown');
            isDragging = true;
            startY = e.clientY;
            startScrollTop = container.scrollTop;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaY = e.clientY - startY;
            const scrollbarHeight = scrollbar.getBoundingClientRect().height;
            const thumbHeight = thumb.getBoundingClientRect().height;
            const maxScrollTop = container.scrollHeight - container.clientHeight;
            const scrollbarTrackHeight = scrollbarHeight - thumbHeight;
            
            const deltaScroll = (deltaY / scrollbarTrackHeight) * maxScrollTop;
            container.scrollTop = startScrollTop + deltaScroll;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Initial update
        updateScrollbar();
        
        // Update on resize
        window.addEventListener('resize', updateScrollbar);
    }
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


function updateMacrosGauges(state) {
    // This function is no longer needed as we removed the macros section
    // The new design focuses on calories, steps, and exercise
    // Macros can be added back later if needed
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

function updateWeightDisplay(state) {
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
