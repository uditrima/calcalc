// Diary Scroll Handler component - Updated with Sentinel Support
// Erstatter eksisterende scroll handler med sentinel-baseret implementering

import { setupSentinelHandler } from './diary_sentinel_handler.js';

/**
 * Sets up scroll detection for sticky container using sentinel approach
 * @param {HTMLElement} diary - The diary element
 * @param {HTMLElement} container - The container element for event dispatching
 * @returns {Object} Handler instance with cleanup method
 */
export function setupScrollHandler(diary, container) {
    if (!diary) {
        console.error('[DiaryScrollHandler] Diary element is required');
        return { cleanup: () => {} };
    }
    
    if (!container) {
        console.error('[DiaryScrollHandler] Container element is required');
        return { cleanup: () => {} };
    }
    
    console.log('[DiaryScrollHandler] Setting up updated scroll handler with sentinel support');
    
    // Initialize sentinel handler
    const sentinelHandler = setupSentinelHandler(diary, container);
    
    if (!sentinelHandler || !sentinelHandler.cleanup) {
        console.error('[DiaryScrollHandler] Failed to initialize sentinel handler');
        return { cleanup: () => {} };
    }
    
    console.log('[DiaryScrollHandler] Updated scroll handler setup completed');
    
    return {
        cleanup: () => {
            console.log('[DiaryScrollHandler] Cleaning up updated scroll handler');
            if (sentinelHandler && sentinelHandler.cleanup) {
                sentinelHandler.cleanup();
            }
        }
    };
}
