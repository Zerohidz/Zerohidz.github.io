/**
 * Seat Allocation module for managing train seat reservations
 * Handles seat checking, allocation, and deallocation
 */

import { trainAPI } from './api.js';
import { CONFIG } from './config.js';

export class SeatAllocationManager {
    constructor() {
        this.allocatedSeat = null; // Stores current allocated seat info
    }

    /**
     * Checks if there's currently an allocated seat
     * @returns {boolean} True if a seat is allocated
     */
    hasAllocatedSeat() {
        return this.allocatedSeat !== null;
    }

    /**
     * Gets current allocated seat information
     * @returns {Object|null} Allocated seat info or null
     */
    getAllocatedSeatInfo() {
        return this.allocatedSeat;
    }

    /**
     * Checks seat availability and allocates first available seat
     * @param {Object} trainInfo - Train information from search results
     * @param {Object} searchParams - Original search parameters
     * @returns {Promise<Object>} Result object with success flag and message
     */
    async checkAndAllocateFirstSeat(trainInfo, searchParams) {
        try {
            console.log('🔍 Checking seat availability for train:', trainInfo.trainId);

            // Step 1: Get seat map
            const seatMapData = await trainAPI.checkSeatMap(
                trainInfo.trainId,
                searchParams.departureStationId,
                searchParams.arrivalStationId
            );

            if (!seatMapData || !seatMapData.seatMaps) {
                return {
                    success: false,
                    message: 'Koltuk haritası alınamadı'
                };
            }

            // Step 2: Find first available seat in selected cabin classes
            const seatToAllocate = this.findFirstAvailableSeat(
                seatMapData.seatMaps,
                searchParams.selectedCabinClasses
            );

            if (!seatToAllocate) {
                return {
                    success: false,
                    message: 'Seçilen kategorilerde boş koltuk bulunamadı'
                };
            }

            console.log('🎯 Found available seat:', seatToAllocate);

            // Step 3: Allocate the seat
            const allocationResult = await trainAPI.allocateSeat({
                trainCarId: seatToAllocate.trainCarId,
                fromStationId: searchParams.departureStationId,
                toStationId: searchParams.arrivalStationId,
                gender: 'M', // Default to male, could be parameterized
                seatNumber: seatToAllocate.seatNumber,
                passengerTypeId: 0,
                totalPassengerCount: 1,
                fareFamilyId: 0
            });

            if (!allocationResult || !allocationResult.allocationId) {
                return {
                    success: false,
                    message: 'Koltuk tutma işlemi başarısız oldu'
                };
            }

            // Step 4: Store allocation info
            this.allocatedSeat = {
                trainName: trainInfo.name,
                trainId: trainInfo.trainId,
                departureTime: trainInfo.departureTime,
                arrivalTime: trainInfo.arrivalTime,
                seatNumber: seatToAllocate.seatNumber,
                trainCarId: seatToAllocate.trainCarId,
                carName: seatToAllocate.carName,
                wagonNumber: seatToAllocate.wagonNumber,
                cabinClassName: seatToAllocate.cabinClassName,
                allocationId: allocationResult.allocationId,
                lockFor: allocationResult.lockFor || 10
            };

            console.log('✅ Seat allocated successfully:', this.allocatedSeat);

            return {
                success: true,
                message: 'Koltuk başarıyla tutuldu',
                seatInfo: this.allocatedSeat
            };

        } catch (error) {
            console.error('❌ Error in seat allocation:', error);
            return {
                success: false,
                message: `Hata: ${error.message}`
            };
        }
    }

    /**
     * Finds the first available seat in selected cabin classes
     * @param {Array} seatMaps - Array of seat map data from API
     * @param {Array} selectedCabinClasses - Array of selected cabin class keys
     * @returns {Object|null} Seat info or null if not found
     */
    findFirstAvailableSeat(seatMaps, selectedCabinClasses) {
        // Convert cabin class keys to IDs for matching
        const selectedCabinClassIds = selectedCabinClasses.map(key => 
            CONFIG.CABIN_CLASSES[key]?.id
        ).filter(id => id !== undefined);

        // Iterate through seat maps
        for (const seatMap of seatMaps) {
            const template = seatMap.seatMapTemplate;
            
            // Check if this car matches our selected cabin classes
            const carCabinClassId = template?.car?.id;
            
            // Get cabin class from car name or template description
            // We need to match against the actual seat items in seatMaps array
            if (!template?.seatMaps) continue;

            // Create a set of occupied seat numbers for this car
            const occupiedSeats = new Set();
            if (seatMap.allocationSeats && Array.isArray(seatMap.allocationSeats)) {
                seatMap.allocationSeats.forEach(alloc => {
                    if (alloc.seatNumber) {
                        occupiedSeats.add(alloc.seatNumber);
                    }
                });
            }

            // Iterate through seat items
            for (const seatItem of template.seatMaps) {
                const item = seatItem.item;
                
                // Check if this is a saleable seat (actual seat, not WC, table, etc.)
                if (!item?.saleable) continue;

                // Check if seat's cabin class matches our selection
                if (!selectedCabinClassIds.includes(item.cabinClassId)) continue;

                // Check if seat has a number (available seats have numbers)
                if (!seatItem.seatNumber) continue;

                // Check if seat is occupied
                if (occupiedSeats.has(seatItem.seatNumber)) continue;

                // Get cabin class info
                const cabinConfig = Object.values(CONFIG.CABIN_CLASSES).find(
                    config => config.id === item.cabinClassId
                );

                // Extract wagon number from description or name
                // Examples: "YHT CAF 1. VAGON BUSINESS", "CAF 2.VAGON ENGELLİ"
                let wagonNumber = '?';
                const wagonText = template.description || template.name || '';
                const wagonMatch = wagonText.match(/(\d+)\s*[\.\s]*VAGON/i);
                if (wagonMatch && wagonMatch[1]) {
                    wagonNumber = wagonMatch[1];
                }

                // This is an available seat in selected cabin class!
                return {
                    trainCarId: seatMap.trainCarId,
                    seatNumber: seatItem.seatNumber,
                    carName: template.car?.name || template.name,
                    wagonNumber: wagonNumber,
                    cabinClassName: cabinConfig?.displayName || 'Bilinmeyen',
                    itemId: item.id
                };
            }
        }

        return null; // No available seat found
    }

    /**
     * Releases the currently allocated seat
     * @returns {Promise<Object>} Result object with success flag and message
     */
    async releaseSeat() {
        if (!this.allocatedSeat) {
            return {
                success: false,
                message: 'Tutulmuş koltuk bulunamadı'
            };
        }

        try {
            console.log('🔓 Releasing seat:', this.allocatedSeat.seatNumber);

            // Call deallocate API
            await trainAPI.deallocateSeat({
                trainCarId: this.allocatedSeat.trainCarId,
                allocationId: this.allocatedSeat.allocationId,
                seatNumber: this.allocatedSeat.seatNumber
            });

            console.log('✅ Seat released successfully');

            // Clear allocated seat info
            this.allocatedSeat = null;

            return {
                success: true,
                message: 'Koltuk başarıyla serbest bırakıldı'
            };

        } catch (error) {
            console.error('❌ Error releasing seat:', error);
            return {
                success: false,
                message: `Hata: ${error.message}`
            };
        }
    }

    /**
     * Clears allocated seat info without calling API
     * Useful for cleanup when allocation fails or expires
     */
    clearAllocation() {
        this.allocatedSeat = null;
    }
}

// Export singleton instance
export const seatAllocationManager = new SeatAllocationManager();
