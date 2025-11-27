/**
 * Calculate page numbers for pagination display
 * @param currentPage - Current active page
 * @param totalPages - Total number of pages
 * @param visiblePages - Number of page buttons to show (default: 5)
 * @returns Array of page numbers to display
 */
export function getPageNumbers(
    currentPage: number,
    totalPages: number,
    visiblePages: number = 5
): number[] {
    const startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    const endPage = Math.min(startPage + visiblePages - 1, totalPages);

    return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );
}

/**
 * Paginate an array of items
 * @param items - Array of items to paginate
 * @param currentPage - Current page number (1-indexed)
 * @param itemsPerPage - Number of items per page
 * @returns Paginated slice of items
 */
export function paginateArray<T>(
    items: T[],
    currentPage: number,
    itemsPerPage: number
): T[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
}

/**
 * Calculate total number of pages
 * @param totalItems - Total number of items
 * @param itemsPerPage - Number of items per page
 * @returns Total number of pages
 */
export function getTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Get pagination info object
 * @param items - Array of items
 * @param currentPage - Current page number
 * @param itemsPerPage - Items per page
 * @param visiblePages - Visible page buttons
 * @returns Pagination info object
 */
export function getPaginationInfo<T>(
    items: T[],
    currentPage: number,
    itemsPerPage: number,
    visiblePages: number = 5
) {
    const totalPages = getTotalPages(items.length, itemsPerPage);
    const paginatedItems = paginateArray(items, currentPage, itemsPerPage);
    const pageNumbers = getPageNumbers(currentPage, totalPages, visiblePages);

    return {
        totalPages,
        paginatedItems,
        pageNumbers,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
}
