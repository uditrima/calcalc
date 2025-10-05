// Custom scrollbar component for dashboard
import { createCustomScrollbar as createScrollbar, ScrollbarConfig } from '../../utils/custom_scrollbar.js';

/**
 * Creates a custom scrollbar for the given container
 * @param {HTMLElement} container - The container element to add scrollbar to
 * @returns {CustomScrollbar} The scrollbar instance
 */
export function createCustomScrollbar(container) {
    return createScrollbar(container, ScrollbarConfig.DASHBOARD);
}