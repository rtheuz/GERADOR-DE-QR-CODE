/**
 * Storage Manager
 * Handles localStorage with fallbacks and data management
 */

class StorageManager {
    constructor() {
        this.storageAvailable = this.checkStorageAvailability();
        this.memoryCache = {};
    }
    
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available, using memory cache');
            return false;
        }
    }
    
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            
            if (this.storageAvailable) {
                localStorage.setItem(key, serialized);
            }
            
            // Always keep in memory cache as backup
            this.memoryCache[key] = value;
            
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        try {
            let value;
            
            if (this. storageAvailable) {
                value = localStorage.getItem(key);
            } else {
                value = this. memoryCache[key];
            }
            
            if (value === null || value === undefined) {
                return defaultValue;
            }
            
            // Try to parse JSON
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        } catch (error) {
            console.error('Error reading from storage:', error);
            return defaultValue;
        }
    }
    
    remove(key) {
        try {
            if (this.storageAvailable) {
                localStorage.removeItem(key);
            }
            delete this.memoryCache[key];
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }
    
    clear() {
        try {
            if (this.storageAvailable) {
                localStorage.clear();
            }
            this. memoryCache = {};
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
    
    getSize() {
        if (! this.storageAvailable) {
            return 0;
        }
        
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        
        return total;
    }
    
    getSizeFormatted() {
        const bytes = this.getSize();
        const kb = bytes / 1024;
        
        if (kb < 1024) {
            return `${kb.toFixed(2)} KB`;
        }
        
        const mb = kb / 1024;
        return `${mb.toFixed(2)} MB`;
    }
    
    exportData() {
        const data = {};
        
        if (this. storageAvailable) {
            for (let key in localStorage) {
                if (localStorage. hasOwnProperty(key)) {
                    data[key] = localStorage[key];
                }
            }
        } else {
            Object.assign(data, this.memoryCache);
        }
        
        return data;
    }
    
    importData(data) {
        try {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    this.set(key, data[key]);
                }
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Initialize and expose globally
window.StorageManager = new StorageManager();