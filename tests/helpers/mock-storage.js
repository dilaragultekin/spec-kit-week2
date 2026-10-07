/**
 * In-memory MockStorage implementing the Web Storage API (localStorage) interface for testing.
 */
export class MockStorage {
  constructor(initialData = {}, options = {}) {
    this._store = new Map(Object.entries(initialData));
    this.shouldThrowOnSet = options.shouldThrowOnSet || false;
    this.shouldThrowOnGet = options.shouldThrowOnGet || false;
  }

  getItem(key) {
    if (this.shouldThrowOnGet) {
      throw new Error('SecurityError: Access is denied for this document');
    }
    const val = this._store.get(String(key));
    return val !== undefined ? val : null;
  }

  setItem(key, value) {
    if (this.shouldThrowOnSet) {
      throw new Error('QuotaExceededError: The quota has been exceeded');
    }
    this._store.set(String(key), String(value));
  }

  removeItem(key) {
    this._store.delete(String(key));
  }

  clear() {
    this._store.clear();
  }

  get length() {
    return this._store.size;
  }

  key(index) {
    const keys = Array.from(this._store.keys());
    return keys[index] || null;
  }
}
