/**
 * Standard date formatter for the entire application
 * Expected format: dd/mm/yyyy
 */
export const formatDate = (date: string | number | Date | null | undefined): string => {
    if (!date) return "N/A";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Standard time formatter (optional but good for consistency)
 * Expected format: hh:mm AM/PM
 */
export const formatTime = (date: string | number | Date | null | undefined): string => {
    if (!date) return "N/A";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Time";

    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Combined Date and Time formatter
 * Expected format: dd/mm/yyyy hh:mm AM/PM
 */
export const formatDateTime = (date: string | number | Date | null | undefined): string => {
    if (!date) return "N/A";
    return `${formatDate(date)} ${formatTime(date)}`;
};
