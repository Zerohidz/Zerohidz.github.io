/**
 * Utility functions for the Train Ticket Finder application
 */

/**
 * Formats a timestamp to HH:MM format in Turkish locale
 * @param {string|number} timestamp - Unix timestamp or date string
 * @returns {string} Formatted time string (HH:MM)
 */
export function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Checks if a given time is within the specified time range
 * @param {string|number} trainTime - Train departure timestamp
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {boolean} True if within range
 */
export function isInTimeRange(trainTime, startTime, endTime) {
    const trainHourMin = formatTime(trainTime);
    return trainHourMin >= startTime && trainHourMin <= endTime;
}

/**
 * Gets current time formatted in Turkish locale
 * @returns {string} Current time in HH:MM:SS format
 */
export function getCurrentTime() {
    return new Date().toLocaleTimeString('tr-TR');
}

/**
 * Generates a random delay for anti-bot protection
 * @param {number} min - Minimum delay in milliseconds
 * @param {number} max - Maximum delay in milliseconds
 * @returns {number} Random delay value
 */
export function getRandomDelay(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

/**
 * Creates a promise that resolves after specified delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} Promise that resolves after delay
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Converts date from YYYY-MM-DD format (HTML5 date input) to DD-MM-YYYY format (API)
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Date in DD-MM-YYYY format
 */
export function convertDateToAPI(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

/**
 * Converts date from DD-MM-YYYY format (API) to YYYY-MM-DD format (HTML5 input)
 * @param {string} dateString - Date in DD-MM-YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
export function convertDateFromAPI(dateString) {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
}

/**
 * Gets today's date in YYYY-MM-DD format for HTML5 date input
 * @returns {string} Today's date
 */
export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Gets tomorrow's date in YYYY-MM-DD format for HTML5 date input
 * @returns {string} Tomorrow's date
 */
export function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
