import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createFavoriteStorage, STORAGE_KEY } from '../src/storage.js';
import { MockStorage } from './helpers/mock-storage.js';

describe('Favorite Storage Module', () => {
  test('initializes with empty favorites when storage is empty', () => {
    const mock = new MockStorage();
    const storage = createFavoriteStorage(mock);
    assert.deepEqual(storage.getFavorites(), []);
    assert.equal(storage.isFavorite('quote-001'), false);
  });

  test('loads existing valid JSON array from storage', () => {
    const mock = new MockStorage({
      [STORAGE_KEY]: JSON.stringify(['quote-001', 'quote-005'])
    });
    const storage = createFavoriteStorage(mock);
    assert.equal(storage.isFavorite('quote-001'), true);
    assert.equal(storage.isFavorite('quote-005'), true);
    assert.equal(storage.isFavorite('quote-002'), false);
    assert.deepEqual(storage.getFavorites().sort(), ['quote-001', 'quote-005'].sort());
  });

  test('toggleFavorite adds quote and persists JSON array', () => {
    const mock = new MockStorage();
    const storage = createFavoriteStorage(mock);

    const isFavNow = storage.toggleFavorite('quote-003');
    assert.equal(isFavNow, true);
    assert.equal(storage.isFavorite('quote-003'), true);

    const saved = JSON.parse(mock.getItem(STORAGE_KEY));
    assert.deepEqual(saved, ['quote-003']);
  });

  test('toggleFavorite removes quote and persists updated JSON array', () => {
    const mock = new MockStorage({
      [STORAGE_KEY]: JSON.stringify(['quote-003', 'quote-004'])
    });
    const storage = createFavoriteStorage(mock);

    const isFavNow = storage.toggleFavorite('quote-003');
    assert.equal(isFavNow, false);
    assert.equal(storage.isFavorite('quote-003'), false);
    assert.equal(storage.isFavorite('quote-004'), true);

    const saved = JSON.parse(mock.getItem(STORAGE_KEY));
    assert.deepEqual(saved, ['quote-004']);
  });

  test('recovers gracefully from corrupted JSON in storage backend', () => {
    const mock = new MockStorage({
      [STORAGE_KEY]: 'INVALID_NON_JSON_CONTENT{{{'
    });
    const storage = createFavoriteStorage(mock);

    assert.deepEqual(storage.getFavorites(), []);
    assert.equal(storage.isFavorite('quote-001'), false);

    const res = storage.toggleFavorite('quote-001');
    assert.equal(res, true);
    assert.equal(storage.isFavorite('quote-001'), true);
  });

  test('falls back to memory when storage throws quota error on setItem', () => {
    const mock = new MockStorage({}, { shouldThrowOnSet: true });
    const storage = createFavoriteStorage(mock);

    assert.doesNotThrow(() => {
      const res = storage.toggleFavorite('quote-001');
      assert.equal(res, true);
    });

    assert.equal(storage.isFavorite('quote-001'), true);
    assert.deepEqual(storage.getFavorites(), ['quote-001']);
  });

  test('falls back to memory when storage throws security error on getItem', () => {
    const mock = new MockStorage({}, { shouldThrowOnGet: true });
    const storage = createFavoriteStorage(mock);

    assert.doesNotThrow(() => {
      const res = storage.toggleFavorite('quote-002');
      assert.equal(res, true);
    });

    assert.equal(storage.isFavorite('quote-002'), true);
  });

  test('clearFavorites resets both memory and backend', () => {
    const mock = new MockStorage({
      [STORAGE_KEY]: JSON.stringify(['quote-001'])
    });
    const storage = createFavoriteStorage(mock);

    storage.clearFavorites();
    assert.deepEqual(storage.getFavorites(), []);
    assert.equal(mock.getItem(STORAGE_KEY), null);
  });
});

describe('Favorite State Persistence & Transitions (User Story 3 - P3)', () => {
  test('persists favorite state across simulated quote cycling and reloads', () => {
    const sharedMockBackend = new MockStorage();

    // Session 1: User visits, favorites quote-001 and quote-003
    const session1Storage = createFavoriteStorage(sharedMockBackend);
    assert.equal(session1Storage.isFavorite('quote-001'), false);
    session1Storage.toggleFavorite('quote-001');
    assert.equal(session1Storage.isFavorite('quote-001'), true);

    // Transitions to quote-002 (not favorited)
    assert.equal(session1Storage.isFavorite('quote-002'), false);

    // Transitions to quote-003, favorites it
    session1Storage.toggleFavorite('quote-003');
    assert.equal(session1Storage.isFavorite('quote-003'), true);

    // Transitions back to quote-001
    assert.equal(session1Storage.isFavorite('quote-001'), true);

    // Session 2: Page reload with same backend
    const session2Storage = createFavoriteStorage(sharedMockBackend);
    assert.equal(session2Storage.isFavorite('quote-001'), true);
    assert.equal(session2Storage.isFavorite('quote-002'), false);
    assert.equal(session2Storage.isFavorite('quote-003'), true);

    // Unfavorites quote-001 in session 2
    session2Storage.toggleFavorite('quote-001');
    assert.equal(session2Storage.isFavorite('quote-001'), false);

    // Session 3: Another reload
    const session3Storage = createFavoriteStorage(sharedMockBackend);
    assert.equal(session3Storage.isFavorite('quote-001'), false);
    assert.equal(session3Storage.isFavorite('quote-003'), true);
  });

  test('handles toggleFavorite on invalid, empty, or whitespace-only quoteId gracefully', () => {
    const mock = new MockStorage();
    const storage = createFavoriteStorage(mock);

    assert.equal(storage.toggleFavorite(''), false);
    assert.equal(storage.toggleFavorite(null), false);
    assert.equal(storage.toggleFavorite(undefined), false);
    assert.deepEqual(storage.getFavorites(), []);
  });
});
