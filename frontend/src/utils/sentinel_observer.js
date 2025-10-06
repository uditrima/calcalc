// Sentinel Observer Utility
// Genbrugelig utility til at observere sentinel-elementer for sticky behavior

/**
 * Creates a sentinel observer for sticky behavior
 * @param {HTMLElement} sentinelElement - The sentinel element to observe
 * @param {Function} onStickyChange - Callback when sticky state changes
 * @param {Object} options - Observer options
 * @returns {Object} Observer instance with cleanup method
 */
export function createSentinelObserver(sentinelElement, onStickyChange, options = {}) {
    if (!sentinelElement) {
        console.error('[SentinelObserver] Sentinel element is required');
        return { cleanup: () => {} };
    }
    
    if (typeof onStickyChange !== 'function') {
        console.error('[SentinelObserver] onStickyChange callback is required');
        return { cleanup: () => {} };
    }
    
    // Default options for Intersection Observer
    const defaultOptions = {
        threshold: 0,
        rootMargin: '0px',
        root: null
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    console.log('[SentinelObserver] Creating sentinel observer for:', sentinelElement, 'with options:', observerOptions);
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When sentinel is not visible, element should be sticky
            // rootMargin provides hysteresis: +10px top, -10px bottom
            // This prevents flickering when scrolling near the threshold
            const isSticky = !entry.isIntersecting;
            console.log('[SentinelObserver] Sentinel visibility changed:', { 
                isIntersecting: entry.isIntersecting, 
                isSticky,
                rootMargin: observerOptions.rootMargin 
            });
            
            try {
                onStickyChange(isSticky);
            } catch (error) {
                console.error('[SentinelObserver] Error in onStickyChange callback:', error);
            }
        });
    }, observerOptions);
    
    // Start observing the sentinel element
    observer.observe(sentinelElement);
    console.log('[SentinelObserver] Started observing sentinel element');
    
    return {
        cleanup: () => {
            console.log('[SentinelObserver] Cleaning up sentinel observer');
            observer.disconnect();
        }
    };
}

/**
 * Creates a sentinel element for sticky behavior
 * @param {string} className - CSS class name for the sentinel
 * @returns {HTMLElement} The sentinel element
 */
export function createSentinelElement(className = 'sentinel-element') {
    console.log('[SentinelObserver] Creating sentinel element with class:', className);
    
    const sentinel = document.createElement('div');
    sentinel.className = className;
    
    // Set attributes for proper detection
    sentinel.setAttribute('data-sentinel', 'true');
    sentinel.setAttribute('aria-hidden', 'true');
    
    console.log('[SentinelObserver] Sentinel element created:', sentinel);
    
    return sentinel;
}
