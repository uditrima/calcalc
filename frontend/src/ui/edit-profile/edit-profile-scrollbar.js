// Edit Profile Custom Scrollbar Module
import { createCustomScrollbar as createScrollbar, ScrollbarConfig } from '../../utils/custom_scrollbar.js';

/**
 * Creates a custom scrollbar for the edit profile container
 * @param {HTMLElement} container - The container element to add scrollbar to
 * @returns {CustomScrollbar} The scrollbar instance
 */
export function createCustomScrollbar(container) {
    return createScrollbar(container, ScrollbarConfig.DEFAULT);
}