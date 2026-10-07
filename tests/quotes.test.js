import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_QUOTES, getRandomQuote } from '../src/quotes.js';

describe('Quote Catalog & Selection (User Story 1 - P1)', () => {
  test('catalog contains at least 15 curated quotes with valid properties', () => {
    assert.ok(Array.isArray(DEFAULT_QUOTES), 'Catalog should be an array');
    assert.ok(DEFAULT_QUOTES.length >= 15, `Catalog must have >= 15 quotes, got ${DEFAULT_QUOTES.length}`);

    const idSet = new Set();
    for (const quote of DEFAULT_QUOTES) {
      assert.ok(quote.id && typeof quote.id === 'string', 'Quote id must be a non-empty string');
      assert.ok(quote.id.trim() === quote.id, 'Quote id must be trimmed');
      assert.ok(!idSet.has(quote.id), `Duplicate quote id found: ${quote.id}`);
      idSet.add(quote.id);

      assert.ok(quote.text && typeof quote.text === 'string' && quote.text.trim().length > 0,
        `Quote ${quote.id} text must be non-empty trimmed string`);
      assert.ok(quote.author && typeof quote.author === 'string' && quote.author.trim().length > 0,
        `Quote ${quote.id} author must be non-empty trimmed string`);
    }
  });

  test('getRandomQuote selects a valid quote from catalog on initial load', () => {
    const quote = getRandomQuote(DEFAULT_QUOTES);
    assert.ok(quote, 'Should return a quote');
    assert.ok(DEFAULT_QUOTES.some(q => q.id === quote.id), 'Selected quote must exist in catalog');
  });

  test('getRandomQuote supports deterministic randomFn injection', () => {
    const quote0 = getRandomQuote(DEFAULT_QUOTES, null, () => 0);
    assert.equal(quote0.id, DEFAULT_QUOTES[0].id);

    const quoteLast = getRandomQuote(DEFAULT_QUOTES, null, () => 0.999);
    assert.equal(quoteLast.id, DEFAULT_QUOTES[DEFAULT_QUOTES.length - 1].id);
  });

  test('getRandomQuote throws error on empty or invalid catalog', () => {
    assert.throws(() => getRandomQuote([]), /Quote catalog must be a non-empty array/);
    assert.throws(() => getRandomQuote(null), /Quote catalog must be a non-empty array/);
  });
});

describe('New Quote Selection & Repetition Exclusion (User Story 2 - P2)', () => {
  test('getRandomQuote never repeats currentQuoteId when catalog has multiple quotes', () => {
    const currentId = 'quote-001';
    // Run 100 trials with default Math.random
    for (let i = 0; i < 100; i++) {
      const nextQuote = getRandomQuote(DEFAULT_QUOTES, currentId);
      assert.notEqual(nextQuote.id, currentId, `Trial ${i}: immediately repeated ${currentId}`);
    }
  });

  test('getRandomQuote gracefully handles single-item catalog without error or infinite loop', () => {
    const singleCatalog = [{ id: 'solo', text: 'Solo quote', author: 'Solo author' }];
    const nextQuote = getRandomQuote(singleCatalog, 'solo');
    assert.equal(nextQuote.id, 'solo');
  });

  test('getRandomQuote samples evenly across all eligible candidate quotes', () => {
    const testCatalog = [
      { id: 'q1', text: 'T1', author: 'A1' },
      { id: 'q2', text: 'T2', author: 'A2' },
      { id: 'q3', text: 'T3', author: 'A3' }
    ];

    const currentId = 'q1';
    const counts = { q2: 0, q3: 0 };

    for (let i = 0; i < 200; i++) {
      const q = getRandomQuote(testCatalog, currentId);
      counts[q.id]++;
    }

    assert.ok(counts.q2 > 50, `q2 was selected ${counts.q2} times`);
    assert.ok(counts.q3 > 50, `q3 was selected ${counts.q3} times`);
  });
});
