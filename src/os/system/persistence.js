// src/os/system/persistence.js

const STORAGE_KEY = 'smit_os_state_v1';
const SCHEMA_VERSION = 1;

export const loadState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const data = JSON.parse(raw);

        // Version check
        if (data.version !== SCHEMA_VERSION) {
            console.warn('OS State version mismatch. Clearing state.');
            clearState();
            return null;
        }

        return data;
    } catch (err) {
        console.error('Failed to load OS state:', err);
        return null;
    }
};

export const saveState = (updates) => {
    try {
        // Write-only operation: Read raw storage directly to merge, avoiding loadState's validation logic
        const raw = localStorage.getItem(STORAGE_KEY);
        const current = raw ? JSON.parse(raw) : { version: SCHEMA_VERSION };

        const newState = {
            ...current,
            ...updates,
            version: SCHEMA_VERSION,
            sessionTimestamp: Date.now()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
        console.error('Failed to save OS state:', err);
    }
};

export const clearState = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.error('Failed to clear OS state:', err);
    }
};

