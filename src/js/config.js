/**
 * Configuration constants for the Train Ticket Finder application
 */

export const CONFIG = {
    // API Configuration
    API_URL: 'https://web-api-prod-ytp.tcddtasimacilik.gov.tr/tms/train/train-availability?environment=dev&userId=1',
    SEAT_MAP_API_URL: 'https://web-api-prod-ytp.tcddtasimacilik.gov.tr/tms/seat-maps/load-by-train-id?environment=dev&userId=1',
    ALLOCATE_SEAT_API_URL: 'https://web-api-prod-ytp.tcddtasimacilik.gov.tr/tms/inventory/select-seat?environment=dev&userId=1',
    DEALLOCATE_SEAT_API_URL: 'https://web-api-prod-ytp.tcddtasimacilik.gov.tr/tms/inventory/release-seat?environment=dev&userId=1',
    
    // TCDD's hardcoded JWT token (Static token used since 2024)
    // NOTE: "Bearer" prefix is NOT used! Token is sent directly.
    AUTH_TOKEN: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlVFFicDhDMmpiakp1cnUzQVk2a0ZnV196U29MQXZIMmJ5bTJ2OUg5THhRIn0.eyJleHAiOjE3MjEzODQ0NzAsImlhdCI6MTcyMTM4NDQxMCwianRpIjoiYWFlNjVkNzgtNmRkZS00ZGY4LWEwZWYtYjRkNzZiYjZlODNjIiwiaXNzIjoiaHR0cDovL3l0cC1wcm9kLW1hc3RlcjEudGNkZHRhc2ltYWNpbGlrLmdvdi50cjo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMDAzNDI3MmMtNTc2Yi00OTBlLWJhOTgtNTFkMzc1NWNhYjA3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidG1zIiwic2Vzc2lvbl9zdGF0ZSI6IjAwYzM4NTJiLTg1YjEtNDMxNS04OGIwLWQ0MWMxMTcyYzA0MSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6IjAwYzM4NTJiLTg1YjEtNDMxNS04OGIwLWQ0MWMxMTcyYzA0MSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoid2ViIiwiZ2l2ZW5fbmFtZSI6IiIsImZhbWlseV9uYW1lIjoiIn0.AIW_4Qws2wfwxyVg8dgHRT9jB3qNavob2C4mEQIQGl3urzW2jALPx-e51ZwHUb-TXB-X2RPHakonxKnWG6tDIP5aKhiidzXDcr6pDDoYU5DnQhMg1kywyOaMXsjLFjuYN5PAyGUMh6YSOVsg1PzNh-5GrJF44pS47JnB9zk03Pr08napjsZPoRB-5N4GQ49cnx7ePC82Y7YIc-gTew2baqKQPz9_v381Gbm2V38PZDH9KldlcWut7kqQYJFMJ7dkM_entPJn9lFk7R5h5j_06OlQEpWRMQTn9SQ1AYxxmZxBu5XYMKDkn4rzIIVCkdTPJNCt5PvjENjClKFeUA1DOg',
    
    // Timing Configuration
    CHECK_INTERVAL: 5000, // Check interval in milliseconds
    MIN_ANTI_BOT_DELAY: 3000, // Minimum delay for anti-bot protection (ms)
    MAX_ANTI_BOT_DELAY: 8000, // Maximum delay for anti-bot protection (ms)
    
    // Default Values
    DEFAULT_DEPARTURE_STATION: 'KONYA',
    DEFAULT_ARRIVAL_STATION: 'ANKARA GAR',
    
    // Audio Configuration
    MUSIC_VOLUME: 0.8,
    MUSIC_PATH: './assets/success.mp3',
    
    // Cabin class definitions from TCDD API
    CABIN_CLASSES: {
        ECONOMY: {
            id: 2,
            code: 'Y1',
            name: 'Ekonomi',
            displayName: 'Ekonomi Sınıfı'
        },
        BUSINESS: {
            id: 1,
            code: 'C',
            name: 'Business',
            displayName: 'Business Sınıfı'
        },
        SLEEPER: {
            id: 3,
            code: 'SL',
            name: 'Yataklı',
            displayName: 'Yataklı (Kuşet)'
        },
        COUCHETTE: {
            id: 6,
            code: 'CT',
            name: 'Örtülü Kuşet',
            displayName: 'Örtülü Kuşet'
        },
        LOCA: {
            id: 11,
            code: 'L',
            name: 'Loca',
            displayName: 'Loca (Özel Kabin)'
        },
        DISABLED: {
            id: 12,
            code: 'DSB',
            name: 'Tekerlekli Sandalye',
            displayName: 'Engelli (Tekerlekli Sandalye)'
        }
    },
    
    // Paths
    STATIONS_DATA_PATH: './data/stations.json'
};
