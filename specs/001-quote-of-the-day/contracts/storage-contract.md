# Storage Contract: `storage.js`

**Feature**: [Quote of the Day](../spec.md)  
**Contract Version**: 1.0.0  

## Interface Specification

The `storage.js` module provides persistent favorites management backed by `localStorage` with in-memory fallback.

```javascript
/**
 * Creates and initializes a favorites storage instance.
 * @param {Storage} [storageBackend=window.localStorage] - Optional storage backend for testing.
 * @returns {FavoriteStorage}
 */
export function createFavoriteStorage(storageBackend);
```

### Methods on `FavoriteStorage`

#### 1. `getFavorites()`
- **Signature**: `getFavorites(): string[]`
- **Description**: Returns a copy of all favorited quote IDs.
- **Errors**: Catches storage errors and returns in-memory state or `[]`. Never throws.

#### 2. `isFavorite(quoteId)`
- **Signature**: `isFavorite(quoteId: string): boolean`
- **Description**: Returns `true` if `quoteId` is currently favorited; `false` otherwise.

#### 3. `toggleFavorite(quoteId)`
- **Signature**: `toggleFavorite(quoteId: string): boolean`
- **Description**: Toggles favorite status for `quoteId`. Adds it if absent; removes it if present. Persists to storage.
- **Returns**: The new favorite state (`true` if now favorited, `false` if un-favorited).

#### 4. `clearFavorites()`
- **Signature**: `clearFavorites(): void`
- **Description**: Clears all saved favorites from storage and memory (primarily used for test cleanup).

---

## Storage Schema & Serialization

- **Storage Key**: `"qotd_favorite_ids"`
- **Storage Format**: JSON-encoded array of strings.
  - Example: `["quote-001", "quote-003"]`
- **Fault Tolerance**:
  - If `storageBackend.getItem` returns corrupted JSON (e.g. `"{invalid"`), resets cleanly to `[]`.
  - If `storageBackend.setItem` throws (quota exceeded or privacy restriction), state updates in memory without crashing application.
