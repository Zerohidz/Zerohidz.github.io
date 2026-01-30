import { trainAPI } from './api.js';
import { uiManager } from './ui.js';
import { CONFIG } from './config.js';
import { seatAllocationManager } from './seat_allocation.js';
import { formatTime, isInTimeRange, getCurrentTime } from './utils.js';

export class SearchManager {
    constructor() {
        this.searchInterval = null;
        this.isSearching = false;
        this.isFirstRequest = true;
    }

    /**
     * Starts the search process
     */
    startSearch() {
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.isFirstRequest = true; // Reset for new search session
        uiManager.setSearchingState(true);
        uiManager.prepareSuccessAudio();
        // Clear any previous allocation info from UI
        uiManager.hideAllocatedSeat();
        seatAllocationManager.clearAllocation();
        
        uiManager.updateStatus('Arama başlatıldı...', 'searching');
        
        // Perform first check immediately (without delay)
        this.performCheck();
        
        // Schedule periodic checks
        this.searchInterval = setInterval(() => {
            this.performCheck();
        }, CONFIG.CHECK_INTERVAL);
    }

    /**
     * Stops the search process
     */
    stopSearch() {
        if (!this.isSearching) return;
        
        this.isSearching = false;
        uiManager.setSearchingState(false);
        
        if (this.searchInterval) {
            clearInterval(this.searchInterval);
            this.searchInterval = null;
        }
        
        uiManager.stopMusic();
        uiManager.updateStatus('Arama durduruldu.', 'waiting');
    }

    /**
     * Performs a single availability check
     */
    async performCheck() {
        // Skip if API is busy
        if (trainAPI.isRequestInProgress()) {
            return;
        }

        try {
            // Get search parameters from UI
            const params = uiManager.getSearchParams();
            if (!params) {
                this.stopSearch();
                return;
            }

            uiManager.updateStatus('Kontrol ediliyor...', 'searching');
            // Log only periodically or if status changes to avoid spam, but for now we keep as is
            // uiManager.addLog(`🔍 Kontrol ediliyor... (${getCurrentTime()})`);

            // Call API (skip delay on first request for better UX)
            const skipDelay = this.isFirstRequest;
            this.isFirstRequest = false; // Subsequent requests will have delay
            
            const data = await trainAPI.checkAvailability(params, skipDelay);
            
            if (!data) {
                // Request was skipped (another request in progress)
                return;
            }

            // Process results
            const result = this.processTrainData(data, params.timeStart, params.timeEnd, params.selectedCabinClasses);
            
            if (result.found) {
                // Determine if we should really stop. 
                // Only if we found tickets in SELECTED classes (which processTrainData ensures)
                this.handleTicketsFound(result, params);
            } else {
                uiManager.updateStatus('Belirtilen saat aralığında boş koltuk bulunamadı. Arama devam ediyor...', 'searching');
                uiManager.displayResults([]);
            }

        } catch (error) {
            const errorMessage = `❌ Hata: ${error.message}`;
            uiManager.updateStatus(errorMessage, 'error');
            uiManager.addLog(`⚠️ Hata: ${error.message} (${getCurrentTime()})`);
            console.error('Hata detayı:', error);
        }
    }

    /**
     * Processes train data from API response
     * @param {Object} data - API response data
     * @param {string} timeStart - Start time filter
     * @param {string} timeEnd - End time filter
     * @param {Array} selectedCabinClasses - Array of selected cabin class keys (e.g., ['ECONOMY', 'BUSINESS'])
     * @returns {Object} Processed result with found flag and train list
     */
    processTrainData(data, timeStart, timeEnd, selectedCabinClasses) {
        const availableTrains = [];
        let foundAvailable = false;
        let totalSeats = 0;

        // Navigate API response structure
        if (data.trainLegs?.[0]?.trainAvailabilities) {
            const allTrainAvailabilities = data.trainLegs[0].trainAvailabilities;
            
            for (const trainAvailabilities of allTrainAvailabilities) {
                if (trainAvailabilities?.trains) {
                    trainAvailabilities.trains.forEach(train => {
                        // Process each train
                        const trainInfo = this.processTrainAvailability(train, timeStart, timeEnd, selectedCabinClasses);
                        if (trainInfo) {
                            // Check if ANY selected cabin class has availability > 0
                            const hasAvailableSeatsInSelectedClasses = trainInfo.cabinClasses.some(
                                cabin => cabin.availability > 0 && cabin.isSelected
                            );
                            
                            // ONLY ADD TRAIN IF IT HAS AVAILABLE SEATS IN SELECTED CLASSES
                            if (hasAvailableSeatsInSelectedClasses) {
                                foundAvailable = true;
                                const selectedSeats = trainInfo.cabinClasses
                                    .filter(cabin => cabin.isSelected)
                                    .reduce((sum, cabin) => sum + cabin.availability, 0);
                                totalSeats += selectedSeats;
                                
                                // Add train to results
                                availableTrains.push(trainInfo);
                            }
                        }
                    });
                }
            }
        }

        return {
            found: foundAvailable,
            trains: availableTrains,
            totalSeats
        };
    }

    /**
     * Processes a single train's availability
     * @param {Object} train - Train object from API
     * @param {string} timeStart - Start time filter
     * @param {string} timeEnd - End time filter
     * @param {Array} selectedCabinClasses - Array of selected cabin class keys
     * @returns {Object|null} Train info or null if not available
     */
    processTrainAvailability(train, timeStart, timeEnd, selectedCabinClasses) {
        // Check if train has segments
        if (!train.segments || train.segments.length === 0) {
            return null;
        }

        const firstSegment = train.segments[0];
        const lastSegment = train.segments[train.segments.length - 1];
        const departureTime = firstSegment.departureTime;

        // Check time range
        if (!isInTimeRange(departureTime, timeStart, timeEnd)) {
            return null;
        }

        // Check if train has cabin class availabilities
        if (!train.cabinClassAvailabilities) {
            return null;
        }

        // Process all cabin classes
        const cabinClasses = [];
        
        for (const classAvail of train.cabinClassAvailabilities) {
            if (!classAvail.cabinClass) continue;
            
            // Find matching cabin class config
            const cabinConfig = Object.values(CONFIG.CABIN_CLASSES).find(
                config => config.id === classAvail.cabinClass.id
            );
            
            if (!cabinConfig) continue;
            
            // Get cabin class key (e.g., 'ECONOMY', 'BUSINESS', 'LOCA')
            const cabinKey = Object.keys(CONFIG.CABIN_CLASSES).find(
                key => CONFIG.CABIN_CLASSES[key].id === classAvail.cabinClass.id
            );
            
            // Get price from minPrice or bookingClassAvailabilities
            let price = null;
            if (classAvail.minPrice?.parsedValue) {
                price = classAvail.minPrice.parsedValue;
            } else if (classAvail.minPrice) {
                price = classAvail.minPrice;
            } else if (classAvail.bookingClassAvailabilities?.[0]?.price?.parsedValue) {
                price = classAvail.bookingClassAvailabilities[0].price.parsedValue;
            }
            
            cabinClasses.push({
                className: cabinConfig.displayName,
                classKey: cabinKey,
                availability: classAvail.availabilityCount || 0,
                price: price,
                isSelected: selectedCabinClasses.includes(cabinKey)
            });
        }

        // Return train info if it has any cabin classes
        if (cabinClasses.length === 0) {
            return null;
        }

        return {
            trainId: train.id, // VITAL: Added trainId for seat allocation
            name: train.commercialName || train.name,
            departureTime: formatTime(firstSegment.departureTime),
            arrivalTime: formatTime(lastSegment.arrivalTime),
            cabinClasses: cabinClasses
        };
    }

    /**
     * Handles the case when tickets are found
     * @param {Object} result - Search result
     * @param {Object} params - Search parameters (needed for allocation)
     */
    async handleTicketsFound(result, params) {
        // Count only available seats in selected cabin classes
        let actualAvailableSeats = 0;
        result.trains.forEach(train => {
            if (train.cabinClasses) {
                train.cabinClasses.forEach(cabin => {
                    if (cabin.isSelected && cabin.availability > 0) {
                        actualAvailableSeats += cabin.availability;
                    }
                });
            }
        });
        
        if (actualAvailableSeats > 0) {
            // We found AVAILABLE tickets in selected cabin classes!
            const message = `✅ YER BULUNDU! ${actualAvailableSeats} yer mevcut`;
            uiManager.updateStatus(message, 'found');
            uiManager.addLog(`🎉 KOLTUK BULUNDU: ${actualAvailableSeats} yer (${getCurrentTime()})`);
            
            // Stop search FIRST
            this.stopSearch();
            
            // Play alert
            uiManager.playAlert();
            
            // Attempt to allocate seat
            if (!seatAllocationManager.hasAllocatedSeat()) {
                // Find first valid train with seats
                const targetTrain = result.trains[0]; // Logic could be improved to find 'best' train
                if (targetTrain) {
                    uiManager.addLog(`🎫 Otomatik koltuk tutuluyor... (${targetTrain.name})`);
                    
                    const allocResult = await seatAllocationManager.checkAndAllocateFirstSeat(targetTrain, params);
                    
                    if (allocResult.success) {
                        uiManager.addLog(`✅ BAŞARILI: ${allocResult.message}`);
                        uiManager.showAllocatedSeat(allocResult.seatInfo);
                    } else {
                        uiManager.addLog(`⚠️ Koltuk tutulamadı: ${allocResult.message}`);
                    }
                }
            } else {
               uiManager.addLog(`ℹ️ Zaten tutulmuş bir koltuk var.`); 
            }

        } else {
            // All trains are sold out in selected cabin classes
            uiManager.updateStatus(`${result.trains.length} sefer bulundu ancak seçtiğiniz sınıflarda koltuk TÜKENDI. Arama devam ediyor...`, 'searching');
            uiManager.addLog(`⚠️ ${result.trains.length} sefer var ama seçili sınıflarda tükendi (${getCurrentTime()})`);
        }
        
        // Display results (available or sold-out)
        uiManager.displayResults(result.trains);
    }
}

// Export singleton instance
export const searchManager = new SearchManager();
