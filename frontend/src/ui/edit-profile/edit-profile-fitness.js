// Edit Profile Fitness Goals Module
export function createFitnessGoalsSection() {
    const section = document.createElement('div');
    section.className = 'goals-section';
    
    const title = document.createElement('h2');
    title.textContent = 'Fitness mål';
    section.appendChild(title);
    
    const workoutsItem = createFitnessItem('Træninger / uge', '0');
    section.appendChild(workoutsItem);
    
    const minutesItem = createFitnessItem('Minutter / træning', '0');
    section.appendChild(minutesItem);
    
    const exerciseCaloriesItem = createGoalItem(
        'Trænings kalorier',
        'Beslut om du vil justere daglige mål når du træner'
    );
    section.appendChild(exerciseCaloriesItem);
    
    return section;
}

function createFitnessItem(label, value) {
    const item = document.createElement('div');
    item.className = 'fitness-item';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'fitness-label';
    labelEl.textContent = label;
    item.appendChild(labelEl);
    
    const valueEl = document.createElement('div');
    valueEl.className = 'fitness-value';
    valueEl.textContent = value;
    item.appendChild(valueEl);
    
    return item;
}

function createGoalItem(title, description) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'goal-title';
    titleEl.textContent = title;
    item.appendChild(titleEl);
    
    if (description) {
        const descEl = document.createElement('div');
        descEl.className = 'goal-description';
        descEl.textContent = description;
        item.appendChild(descEl);
    }
    
    return item;
}
