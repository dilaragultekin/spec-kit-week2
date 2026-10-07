import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { initApp } from '../src/app.js';
import { MockStorage } from './helpers/mock-storage.js';

class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName;
    this.textContent = '';
    this.attributes = new Map();
    this.listeners = new Map();
    this.title = '';
  }

  setAttribute(name, val) {
    this.attributes.set(name, String(val));
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  addEventListener(event, fn) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(fn);
  }

  click() {
    const handlers = this.listeners.get('click') || [];
    for (const h of handlers) {
      h({ type: 'click', target: this });
    }
  }
}

describe('End-to-End Application Flow Integration', () => {
  test('bootstraps initial quote, advances on new quote, and persists favorite', () => {
    const elements = {
      'quote-text': new MockElement('quote-text', 'blockquote'),
      'quote-author': new MockElement('quote-author', 'figcaption'),
      'new-quote-btn': new MockElement('new-quote-btn', 'button'),
      'favorite-btn': new MockElement('favorite-btn', 'button'),
      'favorite-label': new MockElement('favorite-label', 'span')
    };

    // Mock document.getElementById
    const originalDocument = globalThis.document;
    globalThis.document = {
      getElementById: (id) => elements[id] || null,
      readyState: 'complete'
    };

    const mockBackend = new MockStorage();

    try {
      // 1. Initial Load (Scenario A)
      const app = initApp({ storageBackend: mockBackend });
      assert.ok(app, 'App should initialize');

      const initialQuote = app.getCurrentQuote();
      assert.ok(initialQuote, 'Initial quote must exist');
      assert.equal(elements['quote-text'].textContent, initialQuote.text);
      assert.equal(elements['quote-author'].textContent, `— ${initialQuote.author}`);
      assert.equal(elements['favorite-btn'].getAttribute('aria-pressed'), 'false');
      assert.equal(elements['favorite-label'].textContent, 'Favorite');

      // 2. Request New Quote (Scenario B)
      elements['new-quote-btn'].click();
      const secondQuote = app.getCurrentQuote();
      assert.ok(secondQuote, 'Second quote must exist');
      assert.notEqual(secondQuote.id, initialQuote.id, 'New quote must not repeat immediate predecessor');
      assert.equal(elements['quote-text'].textContent, secondQuote.text);

      // 3. Persistent Favoriting (Scenario C)
      elements['favorite-btn'].click();
      assert.equal(elements['favorite-btn'].getAttribute('aria-pressed'), 'true');
      assert.equal(elements['favorite-label'].textContent, 'Favorited');
      assert.equal(app.storage.isFavorite(secondQuote.id), true);

      // Verify persistence in storage backend
      assert.ok(mockBackend.getItem('qotd_favorite_ids').includes(secondQuote.id));

      // 4. Simulate Page Reload with same storage backend
      const appAfterReload = initApp({ storageBackend: mockBackend });
      assert.equal(appAfterReload.storage.isFavorite(secondQuote.id), true);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
