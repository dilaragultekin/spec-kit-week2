/**
 * Storage key for persistent favorite quote IDs.
 */
export const STORAGE_KEY = 'qotd_favorite_ids';

/**
 * Creates and initializes a favorites storage instance.
 * @param {Storage} [storageBackend] - Storage backend, defaults to window.localStorage in browser.
 */
export function createFavoriteStorage(storageBackend) {
  // Resolve storage backend safely (handles Node.js test environment vs browser)
  let backend = storageBackend;
  if (!backend && typeof window !== 'undefined' && window.localStorage) {
    backend = window.localStorage;
  }

  // In-memory fallback Set for resilient operation
  const memoryFavorites = new Set();
  let useFallbackOnly = false;

  // Initialize from storage backend if available
  if (backend) {
    try {
      const raw = backend.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const id of parsed) {
            if (typeof id === 'string' && id.trim()) {
              memoryFavorites.add(id.trim());
            }
          }
        }
      }
    } catch (err) {
      // JSON parse error, SecurityError, etc.
      // Corrupted data or storage access denied: use empty set & mark fallback if backend broken
      try {
        backend.setItem(STORAGE_KEY, JSON.stringify([]));
      } catch {
        useFallbackOnly = true;
      }
    }
  } else {
    useFallbackOnly = true;
  }

  function persist() {
    if (useFallbackOnly || !backend) {
      return;
    }
    try {
      const serialized = JSON.stringify(Array.from(memoryFavorites));
      backend.setItem(STORAGE_KEY, serialized);
    } catch (err) {
      // QuotaExceededError or SecurityError - gracefully fall back to memory
      useFallbackOnly = true;
    }
  }

  return {
    /**
     * Returns an array of all favorited quote IDs.
     * @returns {string[]}
     */
    getFavorites() {
      return Array.from(memoryFavorites);
    },

    /**
     * Checks if a quote ID is favorited.
     * @param {string} quoteId
     * @returns {boolean}
     */
    isFavorite(quoteId) {
      if (!quoteId || typeof quoteId !== 'string') {
        return false;
      }
      return memoryFavorites.has(quoteId);
    },

    /**
     * Toggles the favorite status for a quote ID.
     * @param {string} quoteId
     * @returns {boolean} - The new favorite state (true if favorited, false if unfavorited)
     */
    toggleFavorite(quoteId) {
      if (!quoteId || typeof quoteId !== 'string') {
        return false;
      }
      const trimmedId = quoteId.trim();
      let newState = false;
      if (memoryFavorites.has(trimmedId)) {
        memoryFavorites.delete(trimmedId);
        newState = false;
      } else {
        memoryFavorites.add(trimmedId);
        newState = true;
      }
      persist();
      return newState;
    },

    /**
     * Clears all favorites from memory and storage backend.
     */
    clearFavorites() {
      memoryFavorites.clear();
      if (!useFallbackOnly && backend) {
        try {
          backend.removeItem(STORAGE_KEY);
        } catch {
          // ignore error
        }
      }
    }
  };
}
