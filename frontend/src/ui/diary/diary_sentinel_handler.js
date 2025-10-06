// Diary Sentinel Handler component
// Håndterer sentinel-baseret sticky behavior for diary summary section

import { createSentinelObserver, createSentinelElement } from '../../utils/sentinel_observer.js';

/**
 * Sets up sentinel-based sticky behavior for diary summary section
 * @param {HTMLElement} diary - The diary element
 * @param {HTMLElement} container - The container element for event dispatching
 * @returns {Object} Handler instance with cleanup method
 */
export function setupSentinelHandler(diary, container) {
    if (!diary) {
        console.error('[DiarySentinelHandler] Diary element is required');
        return { cleanup: () => {} };
    }
    
    if (!container) {
        console.error('[DiarySentinelHandler] Container element is required');
        return { cleanup: () => {} };
    }
    
    console.log('[DiarySentinelHandler] Setting up sentinel handler for diary:', diary);
    
    // Find or create sentinel element before summary section
    const sentinel = insertSentinelBeforeSummary(diary);
    if (!sentinel) {
        console.error('[DiarySentinelHandler] Failed to create sentinel element');
        return { cleanup: () => {} };
    }
    
    // Set up Intersection Observer to watch sentinel
    const onStickyChange = (isSticky) => {
        console.log('[DiarySentinelHandler] Sticky state changed:', isSticky);
        
        // Dispatch CustomEvent for other components (like dashboard)
        const customEvent = new CustomEvent('onStickyStateChange', {
            detail: { isSticky },
            bubbles: true
        });
        container.dispatchEvent(customEvent);
        
        // Update sticky container class for visual feedback
        const stickyContainer = diary.querySelector('.sticky-container');
        if (stickyContainer) {
            if (isSticky) {
                stickyContainer.classList.add('sticky-active');
            } else {
                stickyContainer.classList.remove('sticky-active');
            }
        }
        
        // Update summary section with sticky-mode class
        const summarySection = diary.querySelector('.summary-section');
        if (summarySection) {
            if (isSticky) {
                summarySection.classList.add('sticky-mode');
                console.log('[DiarySentinelHandler] Added sticky-mode class to summary section');
            } else {
                summarySection.classList.remove('sticky-mode');
                console.log('[DiarySentinelHandler] Removed sticky-mode class from summary section');
            }
        }
    };
    
    // Create observer with diary as root for proper scoping
    // Add hysteresis with ±10px rootMargin to prevent flickering
    const observer = createSentinelObserver(sentinel, onStickyChange, {
        root: diary,
        threshold: 0,
        rootMargin: '10px 0px -10px 0px' // Top: 10px, Bottom: -10px for hysteresis
    });
    
    console.log('[DiarySentinelHandler] Sentinel handler setup completed');
    
    return {
        cleanup: () => {
            console.log('[DiarySentinelHandler] Cleaning up sentinel handler');
            observer.cleanup();
            
            // Remove sentinel element
            if (sentinel && sentinel.parentNode) {
                sentinel.parentNode.removeChild(sentinel);
            }
        }
    };
}

/**
 * Inserts sentinel element before summary section
 * @param {HTMLElement} diary - The diary element
 * @returns {HTMLElement} The created sentinel element
 */
export function insertSentinelBeforeSummary(diary) {
    console.log('[DiarySentinelHandler] Inserting sentinel before summary section');
    
    // Find summary section in diary
    const summarySection = diary.querySelector('.summary-section');
    if (!summarySection) {
        console.warn('[DiarySentinelHandler] Summary section not found in diary');
        return null;
    }
    
    // Check if sentinel already exists
    const existingSentinel = diary.querySelector('.diary-sentinel');
    if (existingSentinel) {
        console.log('[DiarySentinelHandler] Sentinel already exists, reusing it');
        return existingSentinel;
    }
    
    // Create sentinel element
    const sentinel = createSentinelElement('diary-sentinel');
    
    // Insert sentinel before sticky container (not before summary section)
    const stickyContainer = summarySection.closest('.sticky-container');
    if (stickyContainer && stickyContainer.parentNode) {
        stickyContainer.parentNode.insertBefore(sentinel, stickyContainer);
        console.log('[DiarySentinelHandler] Sentinel element inserted before sticky container');
    } else {
        // Fallback: insert before summary section
        summarySection.parentNode.insertBefore(sentinel, summarySection);
        console.log('[DiarySentinelHandler] Sentinel element inserted before summary section (fallback)');
    }
    
    return sentinel;
}
