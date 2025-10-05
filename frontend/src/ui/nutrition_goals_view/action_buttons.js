// Nutrition Goals Action Buttons
// Creates action buttons for the nutrition goals view

export function createActionButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'goals-action-buttons';
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'goals-cancel-btn';
    cancelButton.textContent = 'Annuller';
    cancelButton.addEventListener('click', () => {
        // Dim the commit button when canceling
        window.dispatchEvent(new CustomEvent('dimCommitButton'));
        window.dispatchEvent(new CustomEvent('reloadGoals'));
    });
    
    // Commit button (state from goals state)
    const commitButton = document.createElement('button');
    commitButton.className = 'goals-commit-btn';
    commitButton.textContent = 'Gem ændringer';
    commitButton.addEventListener('click', () => {
        if (!commitButton.classList.contains('dimmed')) {
            window.dispatchEvent(new CustomEvent('commitGoals'));
        }
    });
    
    // Apply dimmed state based on goals state
    setTimeout(() => {
        const isDimmed = window.goalsState?.isCommitButtonDimmed?.() ?? true;
        if (isDimmed) {
            commitButton.classList.add('dimmed');
        }
    }, 0);
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(commitButton);
    
    return buttonContainer;
}
