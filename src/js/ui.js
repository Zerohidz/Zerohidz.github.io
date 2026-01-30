/**
 * UI module for managing DOM interactions and updates
 * Handles all user interface updates and user interactions
 */

import { stationManager } from './stations.js';
import { CONFIG } from './config.js';
import { formatTime, convertDateToAPI } from './utils.js';
import { seatAllocationManager } from './seat_allocation.js';

export class UIManager {
    constructor() {
        this.elements = {
            departureStation: document.getElementById('departureStation'),
            arrivalStation: document.getElementById('arrivalStation'),
            departureDate: document.getElementById('departureDate'),
            timeStart: document.getElementById('timeStart'),
            timeEnd: document.getElementById('timeEnd'),
            cabinEconomy: document.getElementById('cabinEconomy'),
            cabinBusiness: document.getElementById('cabinBusiness'),
            cabinSleeper: document.getElementById('cabinSleeper'),
            cabinCouchette: document.getElementById('cabinCouchette'),
            cabinLoca: document.getElementById('cabinLoca'),
            cabinDisabled: document.getElementById('cabinDisabled'),
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            stopMusicBtn: document.getElementById('stopMusicBtn'),
            status: document.getElementById('status'),
            results: document.getElementById('results'),
            allocatedSeatInfo: document.getElementById('allocatedSeatInfo'),
            allocatedSeatDetails: document.getElementById('allocatedSeatDetails'),
            releaseSeatBtn: document.getElementById('releaseSeatBtn')
        };

        this.alertSound = document.getElementById('alertSound');
        this.successAudio = null;
    }

    /**
     * Initializes the UI
     */
    async init() {
        try {
            await stationManager.loadStations();
            this.populateStations();
        } catch (error) {
            this.updateStatus('⚠️ İstasyonlar yüklenemedi. Lütfen sayfayı yenileyin.', 'error');
            throw error;
        }

        // Add event listener for release seat button
        if (this.elements.releaseSeatBtn) {
            this.elements.releaseSeatBtn.addEventListener('click', async () => {
                if (confirm('Koltuğu serbest bırakmak istediğinize emin misiniz?')) {
                    const result = await seatAllocationManager.releaseSeat();
                    if (result.success) {
                        this.hideAllocatedSeat();
                        this.addLog('✅ Koltuk serbest bırakıldı.');
                    } else {
                        alert(`Hata: ${result.message}`);
                    }
                }
            });
        }
    }

    /**
     * Populates station dropdown menus
     */
    populateStations() {
        const { departureStation, arrivalStation } = this.elements;
        
        // Clear loading options
        departureStation.innerHTML = '';
        arrivalStation.innerHTML = '';
        
        // Add default option
        const defaultOption = '<option value="">-- İstasyon Seçin --</option>';
        departureStation.innerHTML = defaultOption;
        arrivalStation.innerHTML = defaultOption;
        
        // Get sorted stations
        const sortedStations = stationManager.getSortedStations();
        
        // Add all stations
        sortedStations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = `${station.name} (${station.code})`;
            option.dataset.name = station.name;
            option.dataset.code = station.code;
            
            departureStation.appendChild(option.cloneNode(true));
            arrivalStation.appendChild(option);
        });
        
        // Set default selections
        this.setDefaultStation(departureStation, CONFIG.DEFAULT_DEPARTURE_STATION);
        this.setDefaultStation(arrivalStation, CONFIG.DEFAULT_ARRIVAL_STATION);
    }

    /**
     * Sets default station selection in dropdown
     * @param {HTMLSelectElement} selectElement - Select element
     * @param {string} stationName - Station name to select
     */
    setDefaultStation(selectElement, stationName) {
        const options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].dataset.name === stationName) {
                selectElement.selectedIndex = i;
                break;
            }
        }
    }

    /**
     * Gets the selected station information from a select element
     * @param {HTMLSelectElement} selectElement - The select element
     * @returns {Object|null} Station info or null
     */
    getSelectedStation(selectElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        if (!selectedOption || !selectedOption.value) return null;
        
        return {
            id: parseInt(selectedOption.value),
            name: selectedOption.dataset.name,
            code: selectedOption.dataset.code
        };
    }

    /**
     * Gets current search parameters from form
     * @returns {Object|null} Search parameters or null if invalid
     */
    getSearchParams() {
        const departureStation = this.getSelectedStation(this.elements.departureStation);
        const arrivalStation = this.getSelectedStation(this.elements.arrivalStation);
        
        // Validation: Check if stations are selected
        if (!departureStation || !arrivalStation) {
            this.updateStatus('⚠️ Lütfen kalkış ve varış istasyonlarını seçin', 'error');
            return null;
        }

        // Validation: Check if same station selected
        if (departureStation.id === arrivalStation.id) {
            this.updateStatus('⚠️ Kalkış ve varış istasyonu aynı olamaz', 'error');
            return null;
        }

        // Get and validate date
        const dateValue = this.elements.departureDate.value;
        if (!dateValue) {
            this.updateStatus('⚠️ Lütfen bir tarih seçin', 'error');
            return null;
        }

        // Check if date is not in the past
        const selectedDate = new Date(dateValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            this.updateStatus('⚠️ Geçmiş bir tarih seçemezsiniz', 'error');
            return null;
        }

        // Get and validate time range
        const timeStart = this.elements.timeStart.value;
        const timeEnd = this.elements.timeEnd.value;
        
        if (!timeStart || !timeEnd) {
            this.updateStatus('⚠️ Lütfen saat aralığını belirleyin', 'error');
            return null;
        }

        // Validation: Check time range logic
        if (timeStart > timeEnd) {
            this.updateStatus('⚠️ Başlangıç saati, bitiş saatinden önce olmalıdır', 'error');
            return null;
        }

        // Get selected cabin classes
        const selectedCabinClasses = [];
        if (this.elements.cabinEconomy.checked) selectedCabinClasses.push('ECONOMY');
        if (this.elements.cabinBusiness.checked) selectedCabinClasses.push('BUSINESS');
        if (this.elements.cabinSleeper.checked) selectedCabinClasses.push('SLEEPER');
        if (this.elements.cabinCouchette.checked) selectedCabinClasses.push('COUCHETTE');
        if (this.elements.cabinLoca.checked) selectedCabinClasses.push('LOCA');
        if (this.elements.cabinDisabled.checked) selectedCabinClasses.push('DISABLED');

        // Validation: At least one cabin class must be selected
        if (selectedCabinClasses.length === 0) {
            this.updateStatus('⚠️ En az bir sınıf seçmelisiniz', 'error');
            return null;
        }

        // Convert date from YYYY-MM-DD (HTML5 format) to DD-MM-YYYY (API format)
        const departureDateAPI = convertDateToAPI(dateValue);

        return {
            departureStationId: departureStation.id,
            departureStationName: departureStation.name,
            arrivalStationId: arrivalStation.id,
            arrivalStationName: arrivalStation.name,
            departureDate: departureDateAPI,
            timeStart: timeStart,
            timeEnd: timeEnd,
            selectedCabinClasses: selectedCabinClasses
        };
    }

    /**
     * Updates the status message and styling
     * @param {string} message - Status message to display
     * @param {string} type - Status type (waiting, searching, found, error)
     */
    updateStatus(message, type) {
        this.elements.status.textContent = message;
        this.elements.status.className = `status ${type}`;
    }

    /**
     * Adds a log message to the results area
     * @param {string} message - Log message
     */
    addLog(message) {
        const p = document.createElement('p');
        p.textContent = message;
        this.elements.results.prepend(p);
    }

    /**
     * Displays train results
     * @param {Array} trains - Array of train objects to display
     */
    displayResults(trains) {
        this.elements.results.innerHTML = '';

        if (trains.length === 0) {
            this.elements.results.innerHTML = '<p style="text-align: center; color: #666;">Belirtilen saat aralığında sefer bulunamadı.</p>';
            return;
        }

        trains.forEach(train => {
            const div = document.createElement('div');
            div.className = 'train-item';
            
            // Build cabin classes HTML - ONLY SHOW SELECTED CLASSES
            let cabinClassesHTML = '';
            if (train.cabinClasses && train.cabinClasses.length > 0) {
                // Filter to show only selected cabin classes
                const selectedCabins = train.cabinClasses.filter(cabin => cabin.isSelected);
                
                selectedCabins.forEach(cabin => {
                    const isSoldOut = cabin.availability === 0;
                    const availabilityClass = isSoldOut ? 'availability sold-out' : 'availability';
                    const availabilityText = isSoldOut ? 'TÜKENDİ' : `${cabin.availability} koltuk`;
                    
                    cabinClassesHTML += `
                        <p><strong>${cabin.className}:</strong> 
                            <span class="${availabilityClass}">${availabilityText}</span>
                            ${cabin.price ? ` - ${cabin.price} TL` : ''}
                        </p>
                    `;
                });
            }
            
            div.innerHTML = `
                <h3>${train.name}</h3>
                <p><strong>Kalkış:</strong> ${train.departureTime} | <strong>Varış:</strong> ${train.arrivalTime}</p>
                ${cabinClassesHTML}
            `;
            this.elements.results.appendChild(div);
        });
    }

    /**
     * Sets the searching state (enables/disables buttons)
     * @param {boolean} isSearching - Whether search is active
     */
    setSearchingState(isSearching) {
        this.elements.startBtn.disabled = isSearching;
        this.elements.stopBtn.disabled = !isSearching;
    }

    /**
     * Initializes and prepares success audio
     */
    prepareSuccessAudio() {
        this.successAudio = new Audio(CONFIG.MUSIC_PATH);
        this.successAudio.volume = CONFIG.MUSIC_VOLUME;
    }

    /**
     * Plays alert sounds when tickets are found
     */
    async playAlert() {
        // Play success music
        if (this.successAudio) {
            try {
                await this.successAudio.play();
                this.elements.stopMusicBtn.disabled = false;
            } catch (err) {
                console.log('Müzik çalınamadı:', err);
            }
        }

        // Play beep sound
        try {
            await this.alertSound.play();
        } catch (err) {
            console.log('Ses çalınamadı:', err);
            // Fallback: Speech API
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance('Bilet bulundu! Bilet bulundu!');
                utterance.lang = 'tr-TR';
                utterance.rate = 1.2;
                window.speechSynthesis.speak(utterance);
            }
        }
    }

    /**
     * Stops music playback
     */
    stopMusic() {
        if (this.successAudio) {
            this.successAudio.pause();
            this.successAudio.currentTime = 0;
        }
        this.elements.stopMusicBtn.disabled = true;
    }
    /**
     * Shows allocated seat information
     * @param {Object} seatInfo - Allocated seat details
     */
    showAllocatedSeat(seatInfo) {
        if (!seatInfo) return;

        // Clear any existing timer
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const detailsHtml = `
            <p><strong>Tren:</strong> ${seatInfo.trainName}</p>
            <p><strong>Vagon:</strong> ${seatInfo.wagonNumber} (${seatInfo.cabinClassName})</p>
            <p><strong>Koltuk:</strong> <span class="seat-number">${seatInfo.seatNumber}</span></p>
            <p style="font-size: 1.1em; margin-top: 10px;">
                <strong>Kalkış:</strong> <span style="font-size: 1.2em; color: #2d3748;">${seatInfo.departureTime}</span> - 
                <strong>Varış:</strong> <span style="font-size: 1.2em; color: #2d3748;">${seatInfo.arrivalTime}</span>
            </p>
            <div id="seatTimerAlert" class="timer-alert">
                ⚠️ Bu koltuk <span id="seatTimerCountdown" style="font-weight: bold; color: #d32f2f;">10:00</span> süreyle sizin için ayrılmıştır.
            </div>
        `;

        this.elements.allocatedSeatDetails.innerHTML = detailsHtml;
        this.elements.allocatedSeatInfo.style.display = 'block';
        
        // Start countdown
        // We assume 'lockFor' is in minutes, convert to seconds
        let secondsLeft = (seatInfo.lockFor || 10) * 60;
        
        const updateTimer = () => {
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;
            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            const countdownEl = document.getElementById('seatTimerCountdown');
            if (countdownEl) {
                countdownEl.textContent = formattedTime;
            }

            if (secondsLeft <= 0) {
                clearInterval(this.countdownInterval);
                this.addLog('⚠️ Koltuk tutma süresi doldu.');
                
                // Automatically release/clear UI locally
                // Ideally this would also ensure server side release but usually server auto-releases
                seatAllocationManager.clearAllocation();
                this.hideAllocatedSeat();
            }
            
            secondsLeft--;
        };

        // Update immediately then every second
        updateTimer();
        this.countdownInterval = setInterval(updateTimer, 1000);
        
        // Scroll to allocated seat info
        this.elements.allocatedSeatInfo.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Hides allocated seat information
     */
    hideAllocatedSeat() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        this.elements.allocatedSeatInfo.style.display = 'none';
        this.elements.allocatedSeatDetails.innerHTML = '';
    }
}

// Export singleton instance
export const uiManager = new UIManager();
