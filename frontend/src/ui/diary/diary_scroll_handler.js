// Diary Scroll Handler component

/**
 * Sets up scroll detection for sticky container
 * @param {HTMLElement} diary - The diary element
 * @param {HTMLElement} container - The container element for event dispatching
 */
export function setupScrollHandler(diary, container) {
    let isStickyActive = false;
    let scrollTimeout = null;
    
    function handleDiaryScroll() {
        // Throttle scroll events for performance
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            const stickyContainer = diary.querySelector('.sticky-container');
            if (!stickyContainer) return;
            
            const rect = stickyContainer.getBoundingClientRect();
            const wasSticky = isStickyActive;
            
            // Check if sticky container is actually stuck (top <= 0)
            isStickyActive = rect.top <= 0;
            
            // Only dispatch event if state changed
            if (wasSticky !== isStickyActive) {
                const customEvent = new CustomEvent('onStickyStateChange', {
                    detail: { isSticky: isStickyActive },
                    bubbles: true
                });
                container.dispatchEvent(customEvent);
            }
        }, 16); // ~60fps throttling
    }
    
    // Add scroll listener to diary container
    diary.addEventListener('scroll', handleDiaryScroll);
    console.log('Diary: Scroll listener added');
    
    return {
        cleanup: () => {
            diary.removeEventListener('scroll', handleDiaryScroll);
        }
    };
}
