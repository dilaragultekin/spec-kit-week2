# Quotes Module Contract: `quotes.js`

**Feature**: [Quote of the Day](../spec.md)  
**Contract Version**: 1.0.0  

## Interface Specification

The `quotes.js` module exposes the static quote catalog and pure selection functions.

### Exported Symbols

#### 1. `DEFAULT_QUOTES`
- **Type**: `ReadonlyArray<Quote>`
- **Description**: Curated array of at least 15 default quotes.
- **Each Element**:
  ```typescript
  interface Quote {
    id: string;
    text: string;
    author: string;
  }
  ```

#### 2. `getRandomQuote(catalog, currentQuoteId, randomFn)`
- **Signature**: `getRandomQuote(catalog: Quote[], currentQuoteId?: string | null, randomFn?: () => number): Quote`
- **Description**: Returns a quote uniformly selected from `catalog`. If `currentQuoteId` is provided and `catalog.length > 1`, the quote with `id === currentQuoteId` is excluded from selection.
- **Parameters**:
  - `catalog`: Non-empty array of quotes.
  - `currentQuoteId`: Optional ID of quote to avoid repeating.
  - `randomFn`: Optional random number generator returning `[0, 1)`. Defaults to `Math.random` (supports dependency injection for deterministic testing).
- **Errors**:
  - Throws `TypeError` or `Error` if `catalog` is empty or not an array.
