import { DEFAULT_QUOTES, getRandomQuote } from './quotes.js';
import { createFavoriteStorage } from './storage.js';

/**
 * Initializes the Quote of the Day application.
 * @param {Object} [options]
 * @param {Array} [options.catalog=DEFAULT_QUOTES]
 * @param {Storage} [options.storageBackend]
 */
export function initApp(options = {}) {
  const catalog = options.catalog || DEFAULT_QUOTES;
  const storage = createFavoriteStorage(options.storageBackend);

  // DOM Elements
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAuthorEl = document.getElementById('quote-author');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const favoriteBtn = document.getElementById('favorite-btn');
  const favoriteLabelEl = document.getElementById('favorite-label');

  if (!quoteTextEl || !quoteAuthorEl || !newQuoteBtn || !favoriteBtn) {
    console.error('Quote of the Day: Required DOM elements missing.');
    return null;
  }

  let currentQuote = null;

  /**
   * Updates the favorite button UI based on current quote's favorite state.
   */
  function updateFavoriteButton() {
    if (!currentQuote) return;
    const isFav = storage.isFavorite(currentQuote.id);
    favoriteBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    if (favoriteLabelEl) {
      favoriteLabelEl.textContent = isFav ? 'Favorited' : 'Favorite';
    }
    favoriteBtn.title = isFav ? 'Remove from favorites' : 'Mark as favorite';
  }

  /**
   * Renders the given quote to the DOM.
   * @param {Object} quote
   */
  function displayQuote(quote) {
    currentQuote = quote;
    quoteTextEl.textContent = quote.text;
    quoteAuthorEl.textContent = `— ${quote.author}`;
    updateFavoriteButton();
  }

  /**
   * Selects and displays a new quote from the catalog.
   */
  function loadNextQuote() {
    const nextQuote = getRandomQuote(catalog, currentQuote ? currentQuote.id : null);
    displayQuote(nextQuote);
  }

  // Event Listeners
  newQuoteBtn.addEventListener('click', () => {
    loadNextQuote();
  });

  favoriteBtn.addEventListener('click', () => {
    if (!currentQuote) return;
    storage.toggleFavorite(currentQuote.id);
    updateFavoriteButton();
  });

  // Initial load
  loadNextQuote();

  return {
    getCurrentQuote: () => currentQuote,
    loadNextQuote,
    storage
  };
}

// Auto-initialize when running in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initApp());
  } else {
    initApp();
  }
}
