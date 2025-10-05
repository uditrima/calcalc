// Diary Header component
import { EXTENDED_MEAL_TYPES, getMealDisplayName } from '../../data/meal_types.js';

/**
 * Creates the diary header with title and navigation links
 * @param {HTMLElement} container - The container element
 * @returns {HTMLElement} The header element
 */
export function createDiaryHeader(container) {
    const header = document.createElement('div');
    header.className = 'diary-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Dagbog';
    header.appendChild(title);
    
    // Right side links
    const linksContainer = document.createElement('div');
    linksContainer.className = 'diary-header-links';
    
    // Lightning link
    const lightningLink = document.createElement('button');
    lightningLink.className = 'diary-link lightning-link';
    lightningLink.innerHTML = '⚡<span class="link-number">2</span>';
    lightningLink.title = 'Hurtig tilføjelse';
    linksContainer.appendChild(lightningLink);
    
    // Nutrition link
    const nutritionLink = document.createElement('button');
    nutritionLink.className = 'diary-link nutrition-link';
    nutritionLink.innerHTML = '📊';
    nutritionLink.title = 'Næringsstoffer';
    linksContainer.appendChild(nutritionLink);
    
    // More menu link
    const moreLink = document.createElement('button');
    moreLink.className = 'diary-link more-link';
    moreLink.innerHTML = '⋮';
    moreLink.title = 'Mere';
    linksContainer.appendChild(moreLink);
    
    header.appendChild(linksContainer);
    
    return header;
}

/**
 * Creates the date navigation section
 * @param {HTMLElement} container - The container element for event dispatching
 * @param {Function} onDateChange - Callback function for date changes
 * @returns {Object} Object containing the date navigation elements and current date
 */
export function createDateNavigation(container, onDateChange) {
    const dateNav = document.createElement('div');
    dateNav.className = 'date-navigation';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'date-nav-btn prev-btn';
    prevButton.innerHTML = '&lt;';
    prevButton.title = 'Forrige dag';
    dateNav.appendChild(prevButton);
    
    const dateDisplay = document.createElement('div');
    dateDisplay.className = 'date-display';
    dateDisplay.textContent = formatDate(new Date());
    dateNav.appendChild(dateDisplay);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'date-nav-btn next-btn';
    nextButton.innerHTML = '&gt;';
    nextButton.title = 'Næste dag';
    dateNav.appendChild(nextButton);
    
    // Date navigation functionality
    let currentDate = new Date();
    
    // Add event listeners
    prevButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        dateDisplay.textContent = formatDate(currentDate);
        onDateChange(currentDate);
    });
    
    nextButton.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        dateDisplay.textContent = formatDate(currentDate);
        onDateChange(currentDate);
    });
    
    return {
        element: dateNav,
        currentDate: () => currentDate,
        setDate: (date) => {
            currentDate = new Date(date);
            dateDisplay.textContent = formatDate(currentDate);
        }
    };
}

/**
 * Formats a date for display
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('da-DK', options);
}
