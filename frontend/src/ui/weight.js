// Weight tracking UI component
import { AppState } from '../state/app_state.js';

export function Weight(container) {
    if (!container) {
        throw new Error('Weight requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create weight structure
    const weight = document.createElement('div');
    weight.className = 'weight';
    
    // Header
    const header = document.createElement('div');
    header.className = 'weight-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Vægt Tracking';
    header.appendChild(title);
    
    weight.appendChild(header);
    
    // Add weight form
    const form = createWeightForm();
    weight.appendChild(form);
    
    // Weight entries container
    const entriesContainer = document.createElement('div');
    entriesContainer.className = 'weight-entries';
    weight.appendChild(entriesContainer);
    
    // Add to container
    container.appendChild(weight);
    
    // Subscribe to state changes
    AppState.subscribe('weights', updateWeights);
    
    // Initial update
    updateWeights();
    
    function createWeightForm() {
        const form = document.createElement('form');
        form.className = 'weight-form';
        
        // Date input
        const dateGroup = document.createElement('div');
        dateGroup.className = 'input-group';
        
        const dateLabel = document.createElement('label');
        dateLabel.setAttribute('for', 'weight-date');
        dateLabel.textContent = 'Dato';
        dateGroup.appendChild(dateLabel);
        
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.id = 'weight-date';
        dateInput.name = 'date';
        dateInput.value = new Date().toISOString().split('T')[0];
        dateInput.required = true;
        dateGroup.appendChild(dateInput);
        
        form.appendChild(dateGroup);
        
        // Weight input
        const weightGroup = document.createElement('div');
        weightGroup.className = 'input-group';
        
        const weightLabel = document.createElement('label');
        weightLabel.setAttribute('for', 'weight-kg');
        weightLabel.textContent = 'Vægt (kg)';
        weightLabel.innerHTML += ' <span class="required">*</span>';
        weightGroup.appendChild(weightLabel);
        
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.id = 'weight-kg';
        weightInput.name = 'weight_kg';
        weightInput.step = '0.1';
        weightInput.min = '0';
        weightInput.required = true;
        weightGroup.appendChild(weightInput);
        
        form.appendChild(weightGroup);
        
        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Tilføj Vægt';
        submitButton.className = 'btn-add-weight';
        form.appendChild(submitButton);
        
        // Form submission
        form.addEventListener('submit', handleSubmit);
        
        return form;
    }
    
    function handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const weightData = {
            date: formData.get('date'),
            weight_kg: parseFloat(formData.get('weight_kg'))
        };
        
        // Validate data
        if (!weightData.date || weightData.weight_kg <= 0) {
            showError('Dato og vægt er påkrævede felter');
            return;
        }
        
        // Clear any existing errors
        clearError();
        
        // Dispatch custom event
        const customEvent = new CustomEvent('onAddWeight', {
            detail: weightData,
            bubbles: true
        });
        container.dispatchEvent(customEvent);
        
        // Clear form after successful submission
        event.target.reset();
        event.target.querySelector('#weight-date').value = new Date().toISOString().split('T')[0];
    }
    
    function updateWeights() {
        const state = AppState.getState();
        const weights = state.weights || [];
        
        // Clear existing entries
        entriesContainer.innerHTML = '';
        
        if (weights.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<p>Ingen vægtmålinger registreret. Tilføj din første vægtmåling nedenfor.</p>';
            entriesContainer.appendChild(emptyMessage);
        } else {
            // Sort by date descending (newest first)
            const sortedWeights = [...weights].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Render each weight entry
            sortedWeights.forEach((weightEntry, index) => {
                const weightElement = createWeightElement(weightEntry, index);
                entriesContainer.appendChild(weightElement);
            });
        }
    }
    
    function createWeightElement(weightEntry, index) {
        const weightDiv = document.createElement('div');
        weightDiv.className = 'weight-entry';
        weightDiv.setAttribute('data-weight-id', weightEntry.id);
        
        // Weight content
        const content = document.createElement('div');
        content.className = 'weight-content';
        
        const date = document.createElement('div');
        date.className = 'weight-date';
        date.textContent = new Date(weightEntry.date).toLocaleDateString('da-DK');
        content.appendChild(date);
        
        const weight = document.createElement('div');
        weight.className = 'weight-value';
        weight.textContent = `${weightEntry.weight_kg} kg`;
        content.appendChild(weight);
        
        // Calculate change from previous entry
        if (index > 0) {
            const state = AppState.getState();
            const sortedWeights = [...(state.weights || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
            const previousWeight = sortedWeights[index - 1];
            const change = weightEntry.weight_kg - previousWeight.weight_kg;
            
            const changeDiv = document.createElement('div');
            changeDiv.className = 'weight-change';
            if (change > 0) {
                changeDiv.textContent = `+${change.toFixed(1)} kg`;
                changeDiv.classList.add('increase');
            } else if (change < 0) {
                changeDiv.textContent = `${change.toFixed(1)} kg`;
                changeDiv.classList.add('decrease');
            } else {
                changeDiv.textContent = '0 kg';
                changeDiv.classList.add('no-change');
            }
            content.appendChild(changeDiv);
        }
        
        weightDiv.appendChild(content);
        
        // Weight actions
        const actions = document.createElement('div');
        actions.className = 'weight-actions';
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn-edit';
        editButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onEditWeight', {
                detail: { weight: weightEntry },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(editButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn-delete';
        deleteButton.addEventListener('click', () => {
            const customEvent = new CustomEvent('onDeleteWeight', {
                detail: { weightId: weightEntry.id },
                bubbles: true
            });
            container.dispatchEvent(customEvent);
        });
        actions.appendChild(deleteButton);
        
        weightDiv.appendChild(actions);
        
        return weightDiv;
    }
    
    function showError(message) {
        clearError();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        
        const form = container.querySelector('.weight-form');
        form.appendChild(errorDiv);
    }
    
    function clearError() {
        const existingError = container.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Return the weight element for external access
    return weight;
}
