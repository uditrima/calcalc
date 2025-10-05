// Other UI components for dashboard
/**
 * Creates the exercise section component
 * @returns {HTMLElement} The exercise section element
 */
export function createExerciseSection() {
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

/**
 * Creates the weight section component
 * @returns {HTMLElement} The weight section element
 */
export function createWeightSection() {
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
