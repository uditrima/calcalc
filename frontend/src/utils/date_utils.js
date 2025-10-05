// Date utility functions
// Handles Danish date formatting and date operations

export function getCurrentDateInDanish() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    const danishMonths = [
        'januar', 'februar', 'marts', 'april', 'maj', 'juni',
        'juli', 'august', 'september', 'oktober', 'november', 'december'
    ];
    
    return `${day}. ${danishMonths[month]} ${year}`;
}

export function getCurrentISODate() {
    return new Date().toISOString().split('T')[0];
}

export function formatDateForDisplay(date) {
    if (!date) return '';
    
    // If it's already a Date object
    if (date instanceof Date) {
        return getCurrentDateInDanish();
    }
    
    // If it's an ISO string
    if (typeof date === 'string' && date.includes('T')) {
        const dateObj = new Date(date);
        return getCurrentDateInDanish();
    }
    
    // If it's already in YYYY-MM-DD format
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-');
        const dateObj = new Date(year, month - 1, day);
        return getCurrentDateInDanish();
    }
    
    return date;
}
