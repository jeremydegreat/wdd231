// Storage Module - Handles localStorage operations with error handling and validation

class Storage {
    constructor() {
        this.prefix = 'anambra_jobs_';
        this.isAvailable = this.checkAvailability();
    }

    // Check if localStorage is available
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }

    // Set item in localStorage
    set(key, value) {
        if (!this.isAvailable) {
            return false;
        }

        try {
            const prefixedKey = this.prefix + key;
            const serializedValue = JSON.stringify({
                value: value,
                timestamp: new Date().toISOString(),
                version: '1.0'
            });
            
            localStorage.setItem(prefixedKey, serializedValue);
            return true;
        } catch (error) {
            console.error('Failed to set item in localStorage:', error);
            return false;
        }
    }

    // Get item from localStorage
    get(key) {
        if (!this.isAvailable) {
            return null;
        }

        try {
            const prefixedKey = this.prefix + key;
            const item = localStorage.getItem(prefixedKey);
            
            if (!item) {
                return null;
            }

            const data = JSON.parse(item);
            return data.value;
        } catch (error) {
            console.error('Failed to get item from localStorage:', error);
            return null;
        }
    }

    // Remove item from localStorage
    remove(key) {
        if (!this.isAvailable) {
            return false;
        }

        try {
            const prefixedKey = this.prefix + key;
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error('Failed to remove item from localStorage:', error);
            return false;
        }
    }

    // Clear all items with prefix
    clear() {
        if (!this.isAvailable) {
            return false;
        }

        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
            return false;
        }
    }

    // Get all keys with prefix
    keys() {
        if (!this.isAvailable) {
            return [];
        }

        try {
            const keys = Object.keys(localStorage);
            return keys
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.replace(this.prefix, ''));
        } catch (error) {
            console.error('Failed to get keys from localStorage:', error);
            return [];
        }
    }

    // Get storage info
    getInfo() {
        if (!this.isAvailable) {
            return {
                available: false,
                used: 0,
                remaining: 0,
                keys: []
            };
        }

        try {
            const keys = this.keys();
            let totalSize = 0;

            keys.forEach(key => {
                const item = localStorage.getItem(this.prefix + key);
                totalSize += item ? item.length : 0;
            });

            // Estimate remaining space (rough calculation)
            const maxSize = 5 * 1024 * 1024; // 5MB typical limit
            const remaining = Math.max(0, maxSize - totalSize);

            return {
                available: true,
                used: totalSize,
                remaining: remaining,
                keys: keys,
                keyCount: keys.length
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return {
                available: true,
                used: 0,
                remaining: 0,
                keys: [],
                keyCount: 0
            };
        }
    }

    // Set item with expiration
    setWithExpiry(key, value, ttlMinutes) {
        if (!this.isAvailable) {
            return false;
        }

        try {
            const expiryTime = new Date().getTime() + (ttlMinutes * 60 * 1000);
            const item = {
                value: value,
                expiry: expiryTime,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };

            const prefixedKey = this.prefix + key;
            localStorage.setItem(prefixedKey, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Failed to set item with expiry:', error);
            return false;
        }
    }

    // Get item with expiration check
    getWithExpiry(key) {
        if (!this.isAvailable) {
            return null;
        }

        try {
            const prefixedKey = this.prefix + key;
            const itemStr = localStorage.getItem(prefixedKey);
            
            if (!itemStr) {
                return null;
            }

            const item = JSON.parse(itemStr);
            const now = new Date().getTime();

            // Check if item has expired
            if (item.expiry && now > item.expiry) {
                this.remove(key);
                return null;
            }

            return item.value;
        } catch (error) {
            console.error('Failed to get item with expiry:', error);
            return null;
        }
    }

    // Backup data
    backup() {
        if (!this.isAvailable) {
            return null;
        }

        try {
            const backup = {};
            const keys = this.keys();

            keys.forEach(key => {
                const value = this.get(key);
                if (value !== null) {
                    backup[key] = value;
                }
            });

            return {
                timestamp: new Date().toISOString(),
                version: '1.0',
                data: backup
            };
        } catch (error) {
            console.error('Failed to create backup:', error);
            return null;
        }
    }

    // Restore data
    restore(backupData) {
        if (!this.isAvailable || !backupData || !backupData.data) {
            return false;
        }

        try {
            // Clear existing data
            this.clear();

            // Restore data
            Object.keys(backupData.data).forEach(key => {
                this.set(key, backupData.data[key]);
            });

            return true;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return false;
        }
    }
}

// Specific storage helpers for common data types
class AppStorage extends Storage {
    constructor() {
        super();
    }

    // User preferences
    saveUserPreferences(preferences) {
        return this.set('user_preferences', preferences);
    }

    getUserPreferences() {
        return this.get('user_preferences') || {
            theme: 'light',
            language: 'en',
            notifications: true
        };
    }

    // Search filters
    saveFilters(filters) {
        return this.set('search_filters', filters);
    }

    getFilters() {
        return this.get('search_filters') || {
            type: '',
            location: '',
            category: '',
            search: ''
        };
    }

    // Saved opportunities
    saveOpportunity(opportunityId) {
        const saved = this.getSavedOpportunities();
        if (!saved.includes(opportunityId)) {
            saved.push(opportunityId);
            return this.set('saved_opportunities', saved);
        }
        return true;
    }

    removeSavedOpportunity(opportunityId) {
        const saved = this.getSavedOpportunities();
        const filtered = saved.filter(id => id !== opportunityId);
        return this.set('saved_opportunities', filtered);
    }

    getSavedOpportunities() {
        return this.get('saved_opportunities') || [];
    }

    isOpportunitySaved(opportunityId) {
        const saved = this.getSavedOpportunities();
        return saved.includes(opportunityId);
    }

    // Download history
    addDownload(resource) {
        const downloads = this.getDownloadHistory();
        downloads.push({
            resource: resource,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 downloads
        const recentDownloads = downloads.slice(-50);
        return this.set('download_history', recentDownloads);
    }

    getDownloadHistory() {
        return this.get('download_history') || [];
    }

    // Active tab
    setActiveTab(tabId) {
        return this.set('active_tab', tabId);
    }

    getActiveTab() {
        return this.get('active_tab');
    }

    // Newsletter subscription
    setNewsletterSubscribed(email) {
        return this.set('newsletter_subscribed', {
            email: email,
            timestamp: new Date().toISOString()
        });
    }

    isNewsletterSubscribed() {
        return this.get('newsletter_subscribed') !== null;
    }

    // Visit tracking
    recordVisit(page) {
        const visits = this.getVisits();
        visits.push({
            page: page,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 visits
        const recentVisits = visits.slice(-100);
        return this.set('page_visits', recentVisits);
    }

    getVisits() {
        return this.get('page_visits') || [];
    }

    // Cache management
    setCache(key, data, ttlMinutes = 60) {
        return this.setWithExpiry(`cache_${key}`, data, ttlMinutes);
    }

    getCache(key) {
        return this.getWithExpiry(`cache_${key}`);
    }

    clearCache() {
        const keys = this.keys();
        const cacheKeys = keys.filter(key => key.startsWith('cache_'));
        cacheKeys.forEach(key => this.remove(key));
        return true;
    }
}

// Create singleton instances
const storage = new Storage();
const appStorage = new AppStorage();

// Export for use in other modules
export { storage, appStorage };