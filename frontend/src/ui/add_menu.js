// Add Menu UI component
export function AddMenu(container) {
    if (!container) {
        throw new Error('AddMenu requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create add menu structure
    const addMenu = document.createElement('div');
    addMenu.className = 'add-menu';
    
    // Top section with 2x2 grid
    const topSection = document.createElement('div');
    topSection.className = 'add-menu-top';
    
    // Log Food card
    const logFoodCard = createActionCard('Log Food', '🔍', '#4A90E2');
    logFoodCard.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddFood', {
            detail: { action: 'log-food' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    topSection.appendChild(logFoodCard);
    
    // Barcode Scan card
    const barcodeCard = createActionCard('Barcode Scan', '📱', '#E24A90');
    barcodeCard.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddFood', {
            detail: { action: 'barcode-scan' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    topSection.appendChild(barcodeCard);
    
    // Voice Log card
    const voiceCard = createActionCard('Voice Log', '🎤', '#904AE2');
    voiceCard.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddFood', {
            detail: { action: 'voice-log' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    topSection.appendChild(voiceCard);
    
    // Meal Scan card
    const mealScanCard = createActionCard('Meal Scan', '📷', '#4AE290');
    mealScanCard.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddFood', {
            detail: { action: 'meal-scan' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    topSection.appendChild(mealScanCard);
    
    addMenu.appendChild(topSection);
    
    // Bottom section with list items
    const bottomSection = document.createElement('div');
    bottomSection.className = 'add-menu-bottom';
    
    // Water item
    const waterItem = createListItem('Water', '💧', '#4A90E2');
    waterItem.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddWater', {
            detail: { action: 'water' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    bottomSection.appendChild(waterItem);
    
    // Weight item
    const weightItem = createListItem('Weight', '⚖️', '#4AE290');
    weightItem.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddWeight', {
            detail: { action: 'weight' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    bottomSection.appendChild(weightItem);
    
    // Exercise item
    const exerciseItem = createListItem('Exercise', '🔥', '#E2904A');
    exerciseItem.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddExercise', {
            detail: { action: 'exercise' },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    bottomSection.appendChild(exerciseItem);
    
    addMenu.appendChild(bottomSection);
    
    // Add to container
    container.appendChild(addMenu);
    
    function createActionCard(title, icon, color) {
        const card = document.createElement('div');
        card.className = 'action-card';
        
        const iconContainer = document.createElement('div');
        iconContainer.className = 'action-icon';
        iconContainer.style.backgroundColor = color;
        iconContainer.textContent = icon;
        
        const titleElement = document.createElement('div');
        titleElement.className = 'action-title';
        titleElement.textContent = title;
        
        card.appendChild(iconContainer);
        card.appendChild(titleElement);
        
        return card;
    }
    
    function createListItem(title, icon, color) {
        const item = document.createElement('div');
        item.className = 'action-list-item';
        
        const iconElement = document.createElement('div');
        iconElement.className = 'list-item-icon';
        iconElement.textContent = icon;
        
        const titleElement = document.createElement('div');
        titleElement.className = 'list-item-title';
        titleElement.textContent = title;
        
        item.appendChild(iconElement);
        item.appendChild(titleElement);
        
        return item;
    }
    
    // Return the add menu element for external access
    return addMenu;
}
