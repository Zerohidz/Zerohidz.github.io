/**
 * Main application entry point
 * Initializes the application and sets up event handlers
 */

import { uiManager } from './ui.js';
import { searchManager } from './search.js';

/**
 * Initializes the application
 */
async function init() {
    try {
        console.log('🚄 Tren Bileti Bulucu başlatılıyor...');
        
        // Initialize UI and load stations
        await uiManager.init();
        
        console.log('✅ Uygulama hazır!');
    } catch (error) {
        console.error('❌ Uygulama başlatılamadı:', error);
    }
}

/**
 * Starts the search
 */
function startSearch() {
    searchManager.startSearch();
}

/**
 * Stops the search
 */
function stopSearch() {
    searchManager.stopSearch();
}

/**
 * Stops music playback
 */
function stopMusic() {
    uiManager.stopMusic();
}

// Make functions globally available for HTML onclick handlers
window.startSearch = startSearch;
window.stopSearch = stopSearch;
window.stopMusic = stopMusic;

// Initialize application when DOM is ready
window.addEventListener('load', init);
