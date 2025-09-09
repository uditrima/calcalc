// Diary UI component
import { AppState } from '../state/app_state.js';

export function Diary(container) {
    if (!container) {
        throw new Error('Diary requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create diary structure
    const diary = document.createElement('div');
    diary.className = 'diary';
    
    // Header
    const header = document.createElement('div');
    header.className = 'diary-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Dagens Dagbog';
    header.appendChild(title);
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Entry';
    addButton.className = 'btn-add-entry';
    addButton.addEventListener('click', () => {
        const customEvent = new CustomEvent('onAddEntry', {
            bubbles: true
        });
        container.dispatchEvent(customEvent);
    });
    header.appendChild(addButton);
    
    diary.appendChild(header);
    
    // Entries container
    const entriesContainer = document.createElement('div');
    entriesContainer.className = 'diary-entries';
    diary.appendChild(entriesContainer);
    
    // Summary section
    const summary = document.createElement('div');
    summary.className = 'diary-summary';
    diary.appendChild(summary);
    
    // Add to container
    container.appendChild(diary);
    
    // Subscribe to state changes
    AppState.subscribe('diary', updateDiary);
    AppState.subscribe('foods', updateDiary);
    
    // Initial update
    updateDiary();
    
    function updateDiary() {
        const state = AppState.getState();
        const entries = state.diary.entries || [];
        const foods = state.foods || [];
        
        // Clear existing entries
        entriesContainer.innerHTML = '';
        
        if (entries.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<p>Ingen entries i dag. Klik "Add Entry" for at tilføje fødevarer.</p>';
            entriesContainer.appendChild(emptyMessage);
        } else {
            // Render each entry
            entries.forEach(entry => {
                const food = foods.find(f => f.id === entry.food_id);
                if (food) {
                    const entryElement = createEntryElement(entry, food);
                    entriesContainer.appendChild(entryElement);
                }
            });
        }
        
        // Update summary
        updateSummary(entries, foods);
    }
    
    function createEntryElement(entry, food) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'diary-entry';
        entryDiv.setAttribute('data-entry-id', entry.id);
        
        // Calculate calories
        const calories = (entry.grams / 100) * food.calories;
        
        // Entry content
        const content = document.createElement('div');
        content.className = 'entry-content';
        
        const foodName = document.createElement('div');
        foodName.className = 'food-name';
        foodName.textContent = food.name;
        content.appendChild(foodName);
        
        const amount = document.createElement('div');
        amount.className = 'entry-amount';
        amount.textContent = `${entry.grams}g`;
        content.appendChild(amount);
        
        const caloriesDisplay = document.createElement('div');
        caloriesDisplay.className = 'entry-calories';
        caloriesDisplay.textContent = `${Math.round(calories)} kcal`;
        content.appendChild(caloriesDisplay);
        
        entryDiv.appendChild(content);
        
        // Entry actions
        const actions = document.createElement('div');
        actions.className = 'entry-actions';
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn-edit';
        editButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onEditEntry', {
                detail: { entry, food },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(editButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn-delete';
        deleteButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onDeleteEntry', {
                detail: { entryId: entry.id },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(deleteButton);
        
        entryDiv.appendChild(actions);
        
        return entryDiv;
    }
    
    function updateSummary(entries, foods) {
        // Calculate totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        entries.forEach(entry => {
            const food = foods.find(f => f.id === entry.food_id);
            if (food) {
                const multiplier = entry.grams / 100;
                totalCalories += food.calories * multiplier;
                totalProtein += (food.protein || 0) * multiplier;
                totalCarbs += (food.carbohydrates || 0) * multiplier;
                totalFat += (food.fat || 0) * multiplier;
            }
        });
        
        // Update summary display
        summary.innerHTML = `
            <div class="summary-title">
                <h3>Dagens Total</h3>
            </div>
            <div class="summary-stats">
                <div class="stat">
                    <span class="stat-label">Kalorier:</span>
                    <span class="stat-value">${Math.round(totalCalories)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Protein:</span>
                    <span class="stat-value">${Math.round(totalProtein)}g</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Kulhydrater:</span>
                    <span class="stat-value">${Math.round(totalCarbs)}g</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Fedt:</span>
                    <span class="stat-value">${Math.round(totalFat)}g</span>
                </div>
            </div>
        `;
    }
}
