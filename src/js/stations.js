/**
 * Station management module
 * Handles loading, storing, and providing access to station data
 */

import { CONFIG } from './config.js';

class StationManager {
    constructor() {
        this.stations = [];
        this.stationsMap = {}; // name -> station object mapping
    }

    /**
     * Loads stations from JSON file
     * @returns {Promise<void>}
     * @throws {Error} If stations cannot be loaded
     */
    async loadStations() {
        try {
            const response = await fetch(CONFIG.STATIONS_DATA_PATH);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load stations`);
            }
            
            this.stations = await response.json();
            
            // Create map for quick lookup
            this.stations.forEach(station => {
                this.stationsMap[station.name] = station;
            });
            
            console.log(`✅ ${this.stations.length} istasyon yüklendi`);
        } catch (error) {
            console.error('İstasyonlar yüklenemedi:', error);
            throw error;
        }
    }

    /**
     * Gets all stations sorted alphabetically
     * @returns {Array} Sorted array of stations
     */
    getSortedStations() {
        return [...this.stations].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }

    /**
     * Gets station by name
     * @param {string} name - Station name
     * @returns {Object|null} Station object or null if not found
     */
    getStationByName(name) {
        return this.stationsMap[name] || null;
    }

    /**
     * Gets station by ID
     * @param {number} id - Station ID
     * @returns {Object|null} Station object or null if not found
     */
    getStationById(id) {
        return this.stations.find(station => station.id === id) || null;
    }
}

// Export singleton instance
export const stationManager = new StationManager();
