/**
 * API module for TCDD train availability
 * Handles all API communication with the TCDD backend
 */

import { CONFIG } from './config.js';
import { getRandomDelay, sleep } from './utils.js';

export class TrainAPI {
    constructor() {
        this.isLoading = false;
    }

    /**
     * Checks if an API request is currently in progress
     * @returns {boolean} True if a request is ongoing
     */
    isRequestInProgress() {
        return this.isLoading;
    }

    /**
     * Fetches train availability from TCDD API
     * @param {Object} params - Search parameters
     * @param {number} params.departureStationId - Departure station ID
     * @param {string} params.departureStationName - Departure station name
     * @param {number} params.arrivalStationId - Arrival station ID
     * @param {string} params.arrivalStationName - Arrival station name
     * @param {string} params.departureDate - Departure date (DD-MM-YYYY)
     * @param {boolean} [skipDelay=false] - Skip anti-bot delay (for first request)
     * @returns {Promise<Object>} API response data
     * @throws {Error} If the request fails
     */
    async checkAvailability(params, skipDelay = false) {
        // Prevent concurrent requests
        if (this.isLoading) {
            console.log('⏳ Önceki istek devam ediyor, atlıyorum...');
            return null;
        }

        try {
            this.isLoading = true;

            // Anti-bot protection: random delay (skip for first request)
            if (!skipDelay) {
                const randomDelay = getRandomDelay(
                    CONFIG.MIN_ANTI_BOT_DELAY,
                    CONFIG.MAX_ANTI_BOT_DELAY
                );
                await sleep(randomDelay);
            }

            const requestBody = {
                searchRoutes: [{
                    departureStationId: params.departureStationId,
                    departureStationName: params.departureStationName,
                    arrivalStationId: params.arrivalStationId,
                    arrivalStationName: params.arrivalStationName,
                    departureDate: `${params.departureDate} 00:00:00`
                }],
                passengerTypeCounts: [{ id: 0, count: 1 }],
                searchReservation: false,
                searchType: 'DOMESTIC',
                blTrainTypes: ['TURISTIK_TREN']
            };

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'tr',
                    'Authorization': CONFIG.AUTH_TOKEN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'unit-id': '3895',
                    'Content-Type': 'application/json',
                    'Origin': 'https://ebilet.tcddtasimacilik.gov.tr'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: API request failed`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('API Error:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Checks seat map for a specific train
     * @param {number} trainId - Train ID
     * @param {number} fromStationId - Departure station ID
     * @param {number} toStationId - Arrival station ID
     * @returns {Promise<Object>} Seat map data
     */
    async checkSeatMap(trainId, fromStationId, toStationId) {
        try {
            const requestBody = {
                fromStationId: fromStationId,
                toStationId: toStationId,
                trainId: trainId,
                legIndex: 0 // Assuming legIndex 0 for now as per curl example
            };

            const response = await fetch(CONFIG.SEAT_MAP_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'tr',
                    'Authorization': CONFIG.AUTH_TOKEN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'unit-id': '3895',
                    'Content-Type': 'application/json',
                    'Origin': 'https://ebilet.tcddtasimacilik.gov.tr'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // If there's an error, try to parse JSON error message if possible
                try {
                    const errorData = await response.json();
                    console.error('Seat Map API Error:', errorData);
                } catch (e) {
                    // Ignore JSON parse error
                }
                throw new Error(`HTTP ${response.status}: Seat map request failed`);
            }

            return await response.json();

        } catch (error) {
            console.error('checkSeatMap Error:', error);
            return null; // Return null on error so flow can continue or be handled gracefully
        }
    }

    /**
     * Allocates a specific seat
     * @param {Object} seatData - Seat allocation data
     * @returns {Promise<Object>} Allocation result
     */
    async allocateSeat(seatData) {
        try {
            const requestBody = {
                trainCarId: seatData.trainCarId,
                fromStationId: seatData.fromStationId,
                toStationId: seatData.toStationId,
                gender: seatData.gender || 'M',
                seatNumber: seatData.seatNumber,
                passengerTypeId: seatData.passengerTypeId || 0,
                totalPassengerCount: seatData.totalPassengerCount || 1,
                fareFamilyId: seatData.fareFamilyId || 0
            };

            const response = await fetch(CONFIG.ALLOCATE_SEAT_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'tr',
                    'Authorization': CONFIG.AUTH_TOKEN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'unit-id': '3895',
                    'Content-Type': 'application/json',
                    'Origin': 'https://ebilet.tcddtasimacilik.gov.tr',
                    'Priority': 'u=0'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    console.error('Allocate Seat API Error:', errorData);
                } catch (e) {}
                throw new Error(`HTTP ${response.status}: Allocation request failed`);
            }

            return await response.json();

        } catch (error) {
            console.error('allocateSeat Error:', error);
            return null;
        }
    }

    /**
     * Releases an allocated seat
     * @param {Object} allocationData - Deallocation data
     * @returns {Promise<Object>} Deallocation result
     */
    async deallocateSeat(allocationData) {
        try {
            const requestBody = {
                trainCarId: allocationData.trainCarId,
                allocationId: allocationData.allocationId,
                seatNumber: allocationData.seatNumber
            };

            const response = await fetch(CONFIG.DEALLOCATE_SEAT_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'tr',
                    'Authorization': CONFIG.AUTH_TOKEN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'unit-id': '3895',
                    'Content-Type': 'application/json',
                    'Origin': 'https://ebilet.tcddtasimacilik.gov.tr'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    console.error('Deallocate Seat API Error:', errorData);
                } catch (e) {}
                throw new Error(`HTTP ${response.status}: Deallocation request failed`);
            }

            // Deallocate API might return 200 OK with empty body or some JSON
            // We just return success if status is OK
            return { success: true };

        } catch (error) {
            console.error('deallocateSeat Error:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const trainAPI = new TrainAPI();
