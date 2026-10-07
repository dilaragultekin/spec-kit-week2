# Phase 0 Research: Quote of the Day (Vanilla HTML/CSS/JS)

**Feature**: [Quote of the Day](spec.md)  
**Branch**: `001-quote-of-the-day`  
**Status**: Completed  

## 1. Architectural Style & Module Structure

### Decision
Use standard modern ES Modules (`type="module"`) with a clear separation of concerns across pure business logic, storage abstraction, and DOM rendering:
- `src/quotes.js`: Static catalog of quotes and random selection logic (with previous-quote exclusion).
- `src/storage.js`: LocalStorage wrapper with error handling and in-memory fallback.
- `src/app.js`: Main application controller and DOM orchestration.
- `src/index.html`: Semantic, accessible HTML markup.
- `src/styles.css`: Responsive, modern styling.

### Rationale
- Aligns directly with Constitution Principle III (Maintainability, Modularity & Loose Coupling) and Principle IV (Simplicity & YAGNI).
- Pure logic functions in `quotes.js` and `storage.js` can be unit tested without requiring a full browser or DOM environment.
- Eliminates the need for compilers, bundlers, transpilers, or frontend frameworks while retaining clean modular architecture.

### Alternatives Considered
- **Single monolithic `script.js`**: Rejected because mixing DOM manipulation, quote data, and storage logic hinders isolated testing and violates the Single Responsibility Principle.
- **Frontend Framework (React, Vue, or Svelte)**: Rejected per user instruction and Principle IV (YAGNI). The feature has a single-page, single-quote view with no complex routing or heavy state trees.

---

## 2. Persistence Strategy: `localStorage`

### Decision
Store favorited quotes in `localStorage` as a serialized JSON array of string IDs under the key `qotd_favorite_ids`.
Provide a resilient storage service that wraps `localStorage.getItem` and `localStorage.setItem` inside `try...catch` blocks, falling back to an in-memory `Set` if `localStorage` is disabled, throws a `SecurityError`, or exceeds quota (e.g. in restrictive private browsing modes).

### Schema
```json
["quote-001", "quote-004", "quote-012"]
```

### Rationale
- User explicitly required persisting favorites in `localStorage`.
- Storing an array of IDs rather than duplicating the entire quote objects avoids data duplication, ensures quotes remain consistent with the catalog, and keeps the payload minimal (< 1 KB).
- The in-memory fallback guarantees that the application never throws unhandled runtime errors if storage access is restricted.

### Alternatives Considered
- **IndexedDB**: Rejected as overengineered for a list of string identifiers (violates YAGNI).
- **Cookies**: Rejected due to size limits, automatic server transmission overhead, and unnecessary complexity.
- **Storing full quote objects in storage**: Rejected because it duplicates static data and risks stale quotes if author/text entries are corrected.

---

## 3. Quote Selection & Repetition Avoidance

### Decision
The selection function `getRandomQuote(catalog, currentQuoteId)` filters out the currently displayed quote (if catalog length > 1) and chooses uniformly at random from the remaining candidates.
The catalog will contain 20 curated quotes with unique string IDs, text, and author attribution.

### Rationale
- Directly satisfies FR-002, FR-004, and edge cases.
- O(N) filtering across a 20-item array takes microseconds and is completely deterministic in automated testing when given an injected random seed or index selector.

### Alternatives Considered
- **Shuffled deck / queue**: Maintain a pre-shuffled deck that pops quotes until empty. Rejected as overly complex for a simple "New quote" button when excluding just the immediate predecessor satisfies all acceptance criteria without complex state management.
- **Pure unrestricted random (`Math.random()` without exclusion)**: Rejected because users can frequently see the identical quote repeated consecutively on small catalogs.

---

## 4. Testing Strategy

### Decision
Implement automated unit testing using the Node.js built-in test runner (`node:test` and `node:assert`) for logic modules (`quotes.js`, `storage.js`), accompanied by an end-to-end manual verification script and browser verification.

### Rationale
- Complies strictly with Constitution Principle II (Test-First & Comprehensive Test Coverage, Non-Negotiable).
- Node.js built-in test runner requires zero third-party dependencies (`npm install` not required), executing tests hermetically and rapidly.
- Decoupled modules allow 100% test coverage for quote selection, repetition prevention, and persistence logic.

### Alternatives Considered
- **Jest / Vitest**: Adds heavy `node_modules` dependencies and configuration files for a pure vanilla project.
- **Manual testing only**: Rejected as a direct violation of Constitution Principle II.

---

## 5. Accessibility & Responsive UI Design

### Decision
- Use semantic HTML elements (`<main>`, `<figure>`, `<blockquote>`, `<figcaption>`, `<button>`).
- Use accessible ARIA attributes (`aria-pressed` for favorite toggle, `aria-live="polite"` for the quote container so screen readers announce new quotes).
- CSS will use standard flexbox/grid layout, system font stack, responsive typography (`clamp()`), and clean mobile-first breakpoints.

### Rationale
- Satisfies FR-008 and SC-005.
- Provides immediate readability and keyboard accessibility (`Enter`/`Space` support on buttons) without third-party UI libraries.
