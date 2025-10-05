// Edit Profile Personal Metrics Module
export function createPersonalMetricsSection() {
    const section = document.createElement('div');
    section.className = 'personal-metrics-section';
    
    const heightItem = createMetricItem('Højde', '179 cm');
    section.appendChild(heightItem);
    
    const startingWeightItem = createMetricItem('Startvægt', '97 kg den 7. jun 2021');
    section.appendChild(startingWeightItem);
    
    const currentWeightItem = createMetricItem('Nuværende vægt', '101.5 kg');
    section.appendChild(currentWeightItem);
    
    const goalWeightItem = createMetricItem('Målvægt', '85 kg');
    section.appendChild(goalWeightItem);
    
    const weeklyGoalItem = createMetricItem('Ugentligt mål', 'Tab 0.5 kg per uge');
    section.appendChild(weeklyGoalItem);
    
    return section;
}

function createMetricItem(label, value) {
    const item = document.createElement('div');
    item.className = 'metric-item';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'metric-label';
    labelEl.textContent = label;
    item.appendChild(labelEl);
    
    const valueEl = document.createElement('div');
    valueEl.className = 'metric-value';
    valueEl.textContent = value;
    item.appendChild(valueEl);
    
    return item;
}
