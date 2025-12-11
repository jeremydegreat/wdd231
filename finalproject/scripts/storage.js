// scripts/storage.js
export function savePreferences(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save preferences:', err);
  }
}

export function getPreferences(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (err) {
    console.error('Failed to get preferences:', err);
    return defaultValue;
  }
}
