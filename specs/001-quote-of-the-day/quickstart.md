# Quickstart & Verification Guide: Quote of the Day

**Feature**: [Quote of the Day](spec.md)  
**Branch**: `001-quote-of-the-day`  
**Status**: Ready for Implementation  

## Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge).
- Node.js (v18+ recommended) to run unit test suites using the built-in test runner (`node --test`).
- An optional local HTTP static server (e.g., Python `python -m http.server 8000` or `npx serve src`) to serve files with standard ES module MIME types.

---

## 1. Running Automated Tests

Run the unit test suite verifying the pure quote selection logic and localStorage persistence adapter:

```powershell
npm test
# or: node --test tests/*.test.js
```

### Expected Output
- Tests pass cleanly with zero failures:
  - Catalog integrity (> 15 quotes, all valid attributes).
  - Selection randomness and predecessor exclusion (repetition prevention).
  - Storage persistence, toggling, and corruption recovery.

---

## 2. Running the Application Locally

1. Start a local static web server from the repository root:
   ```powershell
   python -m http.server 8000
   ```
2. Open `http://localhost:8000/src/index.html` in your browser.

---

## 3. End-to-End Validation Scenarios

### Scenario A: Initial Quote Display (P1)
1. Navigate to `http://localhost:8000/src/index.html`.
2. **Verify**: Exactly one quote card is visible containing non-empty quote text and an author attribution.
3. **Verify**: A "New quote" button and a favorite toggle button are rendered.

### Scenario B: Request New Quote (P2)
1. Note the currently displayed quote text and author.
2. Click the **"New quote"** button.
3. **Verify**: The quote immediately updates to a different quote. The immediate previous quote is not repeated.
4. Click the button 5 times rapidly.
5. **Verify**: The display updates smoothly on each click without stutter or errors.

### Scenario C: Persistent Favoriting Across Reloads (P3)
1. Note the active quote.
2. Click the **Favorite** button.
3. **Verify**: The button indicates favorited state (e.g., filled icon/text and `aria-pressed="true"`).
4. Refresh the page (F5 / Ctrl+R).
5. Open browser developer tools -> Application / Storage -> `localStorage`.
6. **Verify**: `qotd_favorite_ids` contains the ID of the favorited quote.
7. Click "New quote" until the favorited quote reappears, or navigate directly:
   - **Verify**: The favorite button correctly displays as active when viewing that quote.
8. Click the Favorite button again on the active quote.
9. **Verify**: The favorite state toggles to un-favorited and updates in `localStorage`.
