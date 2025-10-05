// DOM Utilities
// Common DOM manipulation patterns and helpers

/**
 * Clears a container element while preserving specific elements
 * @param {HTMLElement} container - The container to clear
 * @param {string[]} preserveSelectors - CSS selectors for elements to preserve
 */
export function clearContainer(container, preserveSelectors = []) {
    if (!container) return;
    
    const elementsToPreserve = [];
    
    // Find elements to preserve
    preserveSelectors.forEach(selector => {
        const element = container.querySelector(selector);
        if (element) {
            elementsToPreserve.push(element);
        }
    });
    
    // Clear container
    container.innerHTML = '';
    
    // Re-append preserved elements
    elementsToPreserve.forEach(element => {
        container.appendChild(element);
    });
}

/**
 * Creates a DOM element with attributes and content
 * @param {string} tagName - The HTML tag name
 * @param {Object} options - Element configuration
 * @param {string} options.className - CSS class name
 * @param {string} options.textContent - Text content
 * @param {string} options.innerHTML - HTML content
 * @param {Object} options.attributes - HTML attributes
 * @param {Object} options.styles - CSS styles
 * @param {HTMLElement[]} options.children - Child elements
 * @returns {HTMLElement} The created element
 */
export function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);
    
    if (options.className) {
        element.className = options.className;
    }
    
    if (options.textContent) {
        element.textContent = options.textContent;
    }
    
    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }
    
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    if (options.styles) {
        Object.assign(element.style, options.styles);
    }
    
    if (options.children) {
        options.children.forEach(child => {
            if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

/**
 * Creates a button element with common patterns
 * @param {Object} options - Button configuration
 * @param {string} options.text - Button text
 * @param {string} options.className - CSS class
 * @param {Function} options.onClick - Click handler
 * @param {string} options.title - Tooltip text
 * @returns {HTMLButtonElement} The created button
 */
export function createButton(options = {}) {
    const button = createElement('button', {
        className: options.className || '',
        textContent: options.text || '',
        attributes: {
            title: options.title || ''
        }
    });
    
    if (options.onClick) {
        button.addEventListener('click', options.onClick);
    }
    
    return button;
}

/**
 * Creates a section element with header and content
 * @param {Object} options - Section configuration
 * @param {string} options.title - Section title
 * @param {string} options.className - CSS class
 * @param {HTMLElement[]} options.children - Child elements
 * @returns {HTMLElement} The created section
 */
export function createSection(options = {}) {
    const section = createElement('section', {
        className: options.className || ''
    });
    
    if (options.title) {
        const header = createElement('div', {
            className: 'section-header',
            children: [
                createElement('h2', {
                    textContent: options.title,
                    className: 'section-title'
                })
            ]
        });
        section.appendChild(header);
    }
    
    if (options.children) {
        options.children.forEach(child => {
            if (child instanceof HTMLElement) {
                section.appendChild(child);
            }
        });
    }
    
    return section;
}

/**
 * Dispatches a custom event with common patterns
 * @param {HTMLElement} target - The target element
 * @param {string} eventName - The event name
 * @param {Object} detail - Event detail object
 * @param {boolean} bubbles - Whether the event bubbles
 */
export function dispatchCustomEvent(target, eventName, detail = {}, bubbles = true) {
    const customEvent = new CustomEvent(eventName, {
        bubbles: bubbles,
        detail: detail
    });
    
    target.dispatchEvent(customEvent);
}

/**
 * Dispatches a custom event to the app container
 * @param {string} eventName - The event name
 * @param {Object} detail - Event detail object
 */
export function dispatchAppEvent(eventName, detail = {}) {
    const appContainer = document.querySelector('#app');
    if (appContainer) {
        dispatchCustomEvent(appContainer, eventName, detail);
    } else {
        dispatchCustomEvent(document, eventName, detail);
    }
}

/**
 * Adds event listener with automatic cleanup tracking
 * @param {HTMLElement} element - The element to add listener to
 * @param {string} event - The event name
 * @param {Function} handler - The event handler
 * @param {Object} options - Event listener options
 * @returns {Function} Cleanup function to remove the listener
 */
export function addEventListenerWithCleanup(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    
    return () => {
        element.removeEventListener(event, handler, options);
    };
}

/**
 * Creates a container with common initialization patterns
 * @param {HTMLElement} container - The container element
 * @param {string} className - CSS class for the main element
 * @param {Function} contentCreator - Function that creates the content
 * @returns {HTMLElement} The created main element
 */
export function initializeContainer(container, className, contentCreator) {
    if (!container) {
        throw new Error('Container element is required');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create main element
    const mainElement = createElement('div', {
        className: className
    });
    
    // Create content
    if (contentCreator) {
        const content = contentCreator(mainElement);
        if (content instanceof HTMLElement) {
            mainElement.appendChild(content);
        }
    }
    
    // Add to container
    container.appendChild(mainElement);
    
    return mainElement;
}
