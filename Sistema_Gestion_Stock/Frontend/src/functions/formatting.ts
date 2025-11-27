/**
 * Format a value for input fields based on field type
 * @param value - The value to format
 * @param fieldType - Type of the input field
 * @returns Formatted value
 */
export function formatValueForInput(
    value: any,
    fieldType?: string
): string | boolean | number {
    // Handle null/undefined
    if (value === null || value === undefined) {
        if (fieldType === 'checkbox') return false;
        return '';
    }

    // Handle dates
    if (fieldType === 'date') {
        try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date.toISOString().slice(0, 10);
            }
        } catch {
            return '';
        }
        return '';
    }

    // Handle checkboxes
    if (fieldType === 'checkbox') {
        return !!value;
    }

    // Handle numbers
    if (fieldType === 'number') {
        const num = Number(value);
        return isNaN(num) ? '' : num;
    }

    // Default: convert to string
    return String(value);
}

/**
 * Format a date for input[type="date"]
 * @param date - Date string or Date object
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDateForInput(date: string | Date): string {
    try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
            return d.toISOString().slice(0, 10);
        }
    } catch {
        return '';
    }
    return '';
}

/**
 * Parse form data to proper types
 * @param data - Raw form data
 * @param numberFields - Array of field names that should be numbers
 * @param dateFields - Array of field names that should be dates
 * @returns Parsed data object
 */
export function parseFormData(
    data: Record<string, any>,
    numberFields: string[] = [],
    dateFields: string[] = []
): Record<string, any> {
    const parsed: Record<string, any> = { ...data };

    // Convert number fields
    numberFields.forEach((field) => {
        if (parsed[field] !== undefined && parsed[field] !== '') {
            parsed[field] = Number(parsed[field]);
        } else {
            parsed[field] = null;
        }
    });

    // Convert date fields
    dateFields.forEach((field) => {
        if (parsed[field]) {
            try {
                parsed[field] = new Date(parsed[field]).toISOString();
            } catch {
                parsed[field] = null;
            }
        } else {
            parsed[field] = null;
        }
    });

    return parsed;
}

/**
 * Format currency value
 * @param value - Numeric value
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = '$'): string {
    return `${currency}${value.toFixed(2)}`;
}

/**
 * Format date for display
 * @param date - Date string or Date object
 * @param locale - Locale string (default: 'es-AR')
 * @returns Formatted date string
 */
export function formatDateForDisplay(
    date: string | Date,
    locale: string = 'es-AR'
): string {
    try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString(locale);
        }
    } catch {
        return '';
    }
    return '';
}
