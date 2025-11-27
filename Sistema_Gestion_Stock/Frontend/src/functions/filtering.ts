/**
 * Normalize a string for searching (lowercase, no spaces)
 * @param str - String to normalize
 * @returns Normalized string
 */
export function normalizeString(str: string): string {
    return str.toLowerCase().replace(/\s/g, '');
}

/**
 * Filter items by search term across multiple fields
 * @param items - Array of items to filter
 * @param searchTerm - Search term
 * @param fields - Array of field names to search in
 * @returns Filtered array
 */
export function filterBySearch<T extends Record<string, any>>(
    items: T[],
    searchTerm: string,
    fields: (keyof T)[]
): T[] {
    if (!searchTerm) return items;

    const normalizedSearch = normalizeString(searchTerm);

    return items.filter((item) =>
        fields.some((field) => {
            const value = item[field];
            if (value === null || value === undefined) return false;
            return normalizeString(String(value)).includes(normalizedSearch);
        })
    );
}

/**
 * Filter items by a single field
 * @param items - Array of items to filter
 * @param searchTerm - Search term
 * @param field - Field name to search in
 * @returns Filtered array
 */
export function filterByField<T extends Record<string, any>>(
    items: T[],
    searchTerm: string,
    field: keyof T
): T[] {
    if (!searchTerm) return items;

    const normalizedSearch = normalizeString(searchTerm);

    return items.filter((item) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return normalizeString(String(value)).includes(normalizedSearch);
    });
}

/**
 * Filter items by active status
 * @param items - Array of items
 * @param showInactive - Whether to show inactive items
 * @returns Filtered array
 */
export function filterByActive<T extends { activo: boolean }>(
    items: T[],
    showInactive: boolean = false
): T[] {
    if (showInactive) return items;
    return items.filter((item) => item.activo);
}

/**
 * Sort items by a field
 * @param items - Array of items to sort
 * @param field - Field to sort by
 * @param ascending - Sort direction (default: true)
 * @returns Sorted array
 */
export function sortByField<T extends Record<string, any>>(
    items: T[],
    field: keyof T,
    ascending: boolean = true
): T[] {
    return [...items].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return ascending ? comparison : -comparison;
    });
}
