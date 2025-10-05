// Nutrition Goals View Utilities
// Utility functions for the nutrition goals view

// Helper function to calculate percentage color
export function calculatePercentageColor(percentage) {
    // Clamp percentage between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    // Convert percentage to 0-1 range
    const normalizedPercentage = clampedPercentage / 100;
    
    // Interpolate between orange (0%) and green (100%)
    // Orange: rgb(171, 116, 72)
    // Green: rgb(108, 152, 122)
    const orangeR = 171, orangeG = 116, orangeB = 72;
    const greenR = 108, greenG = 152, greenB = 122;
    
    const r = Math.round(orangeR + (greenR - orangeR) * normalizedPercentage);
    const g = Math.round(orangeG + (greenG - orangeG) * normalizedPercentage);
    const b = Math.round(orangeB + (greenB - orangeB) * normalizedPercentage);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to activate commit button
export function activateCommitButton() {
    const commitBtn = document.querySelector('.goals-commit-btn');
    if (commitBtn) {
        commitBtn.classList.remove('dimmed');
    }
    // Update state
    window.dispatchEvent(new CustomEvent('activateCommitButton'));
}
