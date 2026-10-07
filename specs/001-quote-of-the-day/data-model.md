# Phase 1 Data Model: Quote of the Day

**Feature**: [Quote of the Day](spec.md)  
**Branch**: `001-quote-of-the-day`  
**Status**: Completed  

## 1. Entities

### 1.1 `Quote`
Represents an individual inspirational quote in the built-in catalog.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `id` | `string` | Unique identifier (e.g., `"quote-001"`) | Required, non-empty, unique across catalog |
| `text` | `string` | The quote text | Required, non-empty, trimmed |
| `author` | `string` | The quote author or attribution | Required, non-empty, trimmed |

#### Example
```json
{
  "id": "quote-001",
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}
```

---

### 1.2 `FavoriteStore`
Represents the persistent client-side storage state of favorited quotes.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `favoriteIds` | `Set<string>` (in-memory) / `string[]` (storage) | Collection of quote identifiers marked as favorite | Unique strings matching valid Quote IDs |

#### Storage Representation (`localStorage`)
- **Key**: `qotd_favorite_ids`
- **Value**: JSON-serialized array of strings, e.g. `["quote-001", "quote-005"]`

---

### 1.3 `AppState`
Represents the runtime state of the active web application session.

| Field | Type | Description | Default |
|---|---|---|---|
| `currentQuote` | `Quote` | The quote currently displayed on screen | Randomly selected from catalog on load |
| `isFavorite` | `boolean` | Whether `currentQuote` is currently favorited | Derived from `favoriteIds.has(currentQuote.id)` |
| `catalog` | `Quote[]` | Immutable array of all built-in quotes | Loaded at initialization (>= 15 quotes) |

---

## 2. State Transitions & Lifecycle

### 2.1 Initialization
```
Page Load
  │
  ├─► Load catalog (quotes.js)
  ├─► Initialize storage (read qotd_favorite_ids from localStorage)
  ├─► Select initial quote: getRandomQuote(catalog, null)
  ├─► Derive isFavorite = isFavorited(initialQuote.id)
  └─► Render quote text, author, and favorite toggle state in DOM
```

### 2.2 Next Quote Action ("New quote" button clicked)
```
User clicks "New quote"
  │
  ├─► Select new quote: getRandomQuote(catalog, currentQuote.id)
  ├─► Update AppState.currentQuote = newQuote
  ├─► Derive isFavorite = isFavorited(newQuote.id)
  └─► Re-render quote display & update favorite button (aria-pressed & visual state)
```

### 2.3 Favorite Toggle Action (Favorite button clicked)
```
User clicks Favorite button
  │
  ├─► If currentQuote is favorited:
  │     └─► Remove currentQuote.id from FavoriteStore
  │         AppState.isFavorite = false
  │
  ├─► Else:
  │     └─► Add currentQuote.id to FavoriteStore
  │         AppState.isFavorite = true
  │
  ├─► Persist updated FavoriteStore to localStorage (serialized JSON)
  └─► Update button visual style & aria-pressed attribute
```

---

## 3. Validation Rules

1. **Quote Catalog Invariance**: The catalog must contain at least 15 valid `Quote` objects upon initialization. No quote may have empty `id`, `text`, or `author`.
2. **Repetition Exclusion**: If `catalog.length > 1`, `getRandomQuote(catalog, currentId).id !== currentId`.
3. **Storage Sanitization**: If `localStorage` contains corrupted or unparseable JSON under `qotd_favorite_ids`, storage must safely fall back to an empty set without throwing exceptions.
4. **Duplicate Prevention**: Favorite IDs in storage must be distinct (enforced via `Set`).
