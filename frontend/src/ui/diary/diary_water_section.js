// Diary Water Section component

/**
 * Creates a water section
 * @param {HTMLElement} container - The container element for event dispatching
 * @returns {HTMLElement} The water section element
 */
export function createWaterSection(container) {
    const section = document.createElement('div');
    section.className = 'meal-section water-section';
    section.setAttribute('data-water-type', 'water');
    
    // Line 1: Title "Vand"
    const line1 = document.createElement('div');
    line1.className = 'water-line-1';
    
    const waterTitle = document.createElement('span');
    waterTitle.className = 'water-title';
    waterTitle.textContent = 'Vand';
    line1.appendChild(waterTitle);
    
    section.appendChild(line1);
    
    // Line 2: Title "Vand" and amount "0 ml"
    const line2 = document.createElement('div');
    line2.className = 'water-line-2';
    
    const waterLabel = document.createElement('div');
    waterLabel.className = 'water-label-container';
    
    const waterLabelText = document.createElement('span');
    waterLabelText.className = 'water-label';
    waterLabelText.textContent = 'Vand';
    waterLabel.appendChild(waterLabelText);
    
    const waterAmount = document.createElement('span');
    waterAmount.className = 'water-amount';
    waterAmount.textContent = '0 ml';
    waterLabel.appendChild(waterAmount);
    
    line2.appendChild(waterLabel);
    
    const separator = document.createElement('div');
    separator.className = 'water-separator';
    line2.appendChild(separator);
    
    section.appendChild(line2);
    
    // Line 3: Add button and more menu
    const line3 = document.createElement('div');
    line3.className = 'water-line-3';
    
    const addButton = document.createElement('button');
    addButton.className = 'add-water-btn';
    addButton.textContent = 'TILFØJ VAND';
    addButton.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddWater', {
            detail: { waterType: 'water' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    line3.appendChild(addButton);
    
    const moreMenu = document.createElement('button');
    moreMenu.className = 'meal-more-menu';
    moreMenu.innerHTML = '⋯';
    moreMenu.title = 'Mere menu';
    line3.appendChild(moreMenu);
    
    section.appendChild(line3);
    
    return section;
}
