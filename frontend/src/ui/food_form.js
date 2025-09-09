// Food form UI component
export function FoodForm(container) {
    if (!container) {
        throw new Error('FoodForm requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create form structure
    const form = document.createElement('form');
    form.className = 'food-form';
    
    // Form title
    const title = document.createElement('h2');
    title.textContent = 'Tilføj Fødevare';
    form.appendChild(title);
    
    // Name input
    const nameGroup = createInputGroup('name', 'text', 'Fødevare navn', true);
    form.appendChild(nameGroup);
    
    // Calories input
    const caloriesGroup = createInputGroup('calories', 'number', 'Kalorier (per 100g)', true);
    form.appendChild(caloriesGroup);
    
    // Protein input
    const proteinGroup = createInputGroup('protein', 'number', 'Protein (g per 100g)', false);
    form.appendChild(proteinGroup);
    
    // Carbs input
    const carbsGroup = createInputGroup('carbs', 'number', 'Kulhydrater (g per 100g)', false);
    form.appendChild(carbsGroup);
    
    // Fat input
    const fatGroup = createInputGroup('fat', 'number', 'Fedt (g per 100g)', false);
    form.appendChild(fatGroup);
    
    // Button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'form-buttons';
    
    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Save';
    saveButton.className = 'btn-save';
    buttonGroup.appendChild(saveButton);
    
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear';
    clearButton.className = 'btn-clear';
    clearButton.addEventListener('click', clearForm);
    buttonGroup.appendChild(clearButton);
    
    form.appendChild(buttonGroup);
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Add to container
    container.appendChild(form);
    
    function createInputGroup(name, type, label, required = false) {
        const group = document.createElement('div');
        group.className = 'input-group';
        
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', name);
        labelElement.textContent = label;
        if (required) {
            labelElement.innerHTML += ' <span class="required">*</span>';
        }
        group.appendChild(labelElement);
        
        const input = document.createElement('input');
        input.type = type;
        input.id = name;
        input.name = name;
        input.required = required;
        input.step = type === 'number' ? '0.1' : undefined;
        input.min = type === 'number' ? '0' : undefined;
        group.appendChild(input);
        
        return group;
    }
    
    function handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const foodData = {
            name: formData.get('name'),
            calories: parseFloat(formData.get('calories')) || 0,
            protein: parseFloat(formData.get('protein')) || 0,
            carbohydrates: parseFloat(formData.get('carbs')) || 0,
            fat: parseFloat(formData.get('fat')) || 0
        };
        
        // Validate required fields
        if (!foodData.name || foodData.calories <= 0) {
            showError('Navn og kalorier er påkrævede felter');
            return;
        }
        
        // Clear any existing errors
        clearError();
        
        // Dispatch custom event
        const customEvent = new CustomEvent('onFoodSave', {
            detail: foodData,
            bubbles: true
        });
        form.dispatchEvent(customEvent);
        
        // Clear form after successful submission
        clearForm();
    }
    
    function clearForm() {
        form.reset();
        clearError();
    }
    
    function showError(message) {
        clearError();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        
        form.insertBefore(errorDiv, form.lastElementChild);
    }
    
    function clearError() {
        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Return the form element for external access
    return form;
}
