// Nutrition Goals Formatters

export function parseNumeric(s) {
    // Sørg for at input altid er en streng
    const str = String(s);
    
    // Fjern alt, der ikke er tal eller decimalpunktum
    const cleaned = str.replace(/[^\d.]/g, '');
    
    // Konverter til tal (float)
    const number = parseFloat(cleaned);
    
    return number;
}

export function formatNumber(v) {
    if (v % 1 === 0) {
        // Hvis v er et heltal
        return String(v);
    } else {
        // Hvis v har decimaler
        return v.toFixed(1);
    }
}
