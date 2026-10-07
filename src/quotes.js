/**
 * @typedef {Object} Quote
 * @property {string} id - Unique identifier
 * @property {string} text - The quote text
 * @property {string} author - The quote author attribution
 */

/** @type {ReadonlyArray<Quote>} */
export const DEFAULT_QUOTES = Object.freeze([
  {
    id: 'quote-001',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs'
  },
  {
    id: 'quote-002',
    text: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein'
  },
  {
    id: 'quote-003',
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra'
  },
  {
    id: 'quote-004',
    text: 'It always seems impossible until it is done.',
    author: 'Nelson Mandela'
  },
  {
    id: 'quote-005',
    text: 'Make it work, make it right, make it fast.',
    author: 'Kent Beck'
  },
  {
    id: 'quote-006',
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson'
  },
  {
    id: 'quote-007',
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain'
  },
  {
    id: 'quote-008',
    text: 'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.',
    author: 'Antoine de Saint-Exupéry'
  },
  {
    id: 'quote-009',
    text: 'Code is like humor. When you have to explain it, it’s bad.',
    author: 'Cory House'
  },
  {
    id: 'quote-010',
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler'
  },
  {
    id: 'quote-011',
    text: 'Optimism is an essential ingredient for innovation.',
    author: 'Bob Iger'
  },
  {
    id: 'quote-012',
    text: 'Before software can be reusable it first has to be usable.',
    author: 'Ralph Johnson'
  },
  {
    id: 'quote-013',
    text: 'Knowledge is power, but enthusiasm pulls the switch.',
    author: 'Ivern Ball'
  },
  {
    id: 'quote-014',
    text: 'The best error message is the one that never shows up.',
    author: 'Thomas Fuchs'
  },
  {
    id: 'quote-015',
    text: 'Experience is simply the name we give our mistakes.',
    author: 'Oscar Wilde'
  },
  {
    id: 'quote-016',
    text: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt'
  },
  {
    id: 'quote-017',
    text: 'Simplicity is the soul of efficiency.',
    author: 'Austin Freeman'
  },
  {
    id: 'quote-018',
    text: 'If you cannot do great things, do small things in a great way.',
    author: 'Napoleon Hill'
  },
  {
    id: 'quote-019',
    text: 'It is not enough to do your best; you must know what to do, and then do your best.',
    author: 'W. Edwards Deming'
  },
  {
    id: 'quote-020',
    text: 'Small daily improvements over time lead to stunning results.',
    author: 'Robin Sharma'
  }
]);

/**
 * Selects a random quote from the catalog, avoiding repeating currentQuoteId if candidates exist.
 * @param {ReadonlyArray<Quote>} catalog
 * @param {string|null} [currentQuoteId=null]
 * @param {() => number} [randomFn=Math.random]
 * @returns {Quote}
 */
export function getRandomQuote(catalog, currentQuoteId = null, randomFn = Math.random) {
  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error('Quote catalog must be a non-empty array');
  }

  const eligibleQuotes = (catalog.length > 1 && currentQuoteId)
    ? catalog.filter(q => q.id !== currentQuoteId)
    : catalog;

  const pool = eligibleQuotes.length > 0 ? eligibleQuotes : catalog;
  const index = Math.floor(randomFn() * pool.length);
  return pool[index];
}
