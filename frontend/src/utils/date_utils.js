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
    
    let dateObj;
    
    // If it's already a Date object
    if (date instanceof Date) {
        dateObj = date;
    }
    // If it's an ISO string
    else if (typeof date === 'string' && date.includes('T')) {
        dateObj = new Date(date);
    }
    // If it's already in YYYY-MM-DD format
    else if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-');
        dateObj = new Date(year, month - 1, day);
    }
    else {
        return date;
    }
    
    // Format the date object to Danish format
    const day = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    
    const danishMonths = [
        'januar', 'februar', 'marts', 'april', 'maj', 'juni',
        'juli', 'august', 'september', 'oktober', 'november', 'december'
    ];
    
    return `${day}. ${danishMonths[month]} ${year}`;
}
