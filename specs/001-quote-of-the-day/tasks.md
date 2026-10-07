# Tasks: Quote of the Day

**Feature**: [Quote of the Day](spec.md)  
**Plan**: [plan.md](plan.md)  
**Branch**: `001-quote-of-the-day`  
**Status**: Implemented  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic workspace structure.

- [X] T001 Create project directories for source and tests: `src/` and `tests/`
- [X] T002 [P] Initialize package configuration with `"type": "module"` and test runner script in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and storage infrastructure that MUST be completed before user stories can be integrated into the DOM.

**⚠️ CRITICAL**: Foundational tasks establish the quote catalog and persistence layer used across all user stories.

- [X] T003 Define static quote catalog with at least 15 curated quotes in `src/quotes.js` (each quote enforcing constraints: `id` required unique string, `text` non-empty trimmed string, `author` non-empty trimmed string)
- [X] T004 [P] Create mock localStorage test helper in `tests/helpers/mock-storage.js`
- [X] T005 Implement storage module in `src/storage.js` complying with `specs/001-quote-of-the-day/contracts/storage-contract.md` (storage key `"qotd_favorite_ids"`, JSON-serialized array of string IDs, with resilient in-memory fallback on quota/security errors)
- [X] T006 [P] Author unit tests for storage persistence, serialization, and error recovery in `tests/storage.test.js`

**Checkpoint**: Foundation ready - storage and data models verified; user story implementation can begin.

---

## Phase 3: User Story 1 - Viewing the Daily Quote (Priority: P1) 🎯 MVP

**Goal**: When a user opens the page, immediately display exactly one inspirational quote and author attribution from the catalog without requiring user interaction.

**Independent Test**: Open `src/index.html` in a web browser; verify that exactly one quote text and author name are prominently rendered immediately upon load.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Author unit tests for catalog integrity and initial quote selection in `tests/quotes.test.js`

### Implementation for User Story 1

- [X] T008 [US1] Implement `getRandomQuote` function for initial selection in `src/quotes.js` (complying with `specs/001-quote-of-the-day/contracts/quotes-module-contract.md`)
- [X] T009 [P] [US1] Create semantic HTML structure with quote card container, blockquote, author, and control buttons in `src/index.html`
- [X] T010 [P] [US1] Add responsive styling, typography, and card layout in `src/styles.css`
- [X] T011 [US1] Implement application bootstrap and initial quote rendering in `src/app.js`

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP.

---

## Phase 4: User Story 2 - Requesting a New Quote (Priority: P2)

**Goal**: When a user clicks the "New quote" button, select and display another quote from the catalog while strictly avoiding repeating the immediately preceding quote.

**Independent Test**: Click the "New quote" button repeatedly; verify the displayed quote changes on each click and never immediately repeats the quote just displayed.

### Tests for User Story 2

- [X] T012 [P] [US2] Author unit tests asserting predecessor exclusion in `getRandomQuote` in `tests/quotes.test.js`

### Implementation for User Story 2

- [X] T013 [US2] Enhance `getRandomQuote` in `src/quotes.js` to exclude `currentQuoteId` when `catalog.length > 1`
- [X] T014 [US2] Wire "New quote" button click handler with `aria-live="polite"` DOM update in `src/app.js`
- [X] T015 [P] [US2] Add button hover, active, and focus-visible styling in `src/styles.css`

**Checkpoint**: User Stories 1 and 2 work seamlessly together; users can cycle through quotes reliably.

---

## Phase 5: User Story 3 - Favoriting and Unfavoriting the Current Quote (Priority: P3)

**Goal**: Allow users to toggle the favorite state of the currently displayed quote, persisting that state in `localStorage` across page reloads and reflecting it accurately whenever that quote is shown.

**Independent Test**: Mark the displayed quote as a favorite, reload the browser, and verify that the quote retains its favorited indicator.

### Tests for User Story 3

- [X] T016 [P] [US3] Author unit tests verifying favorite state query and toggle behavior across quote transitions in `tests/storage.test.js`

### Implementation for User Story 3

- [X] T017 [US3] Wire favorite toggle button click handler to update `storage.js` and set `aria-pressed` in `src/app.js`
- [X] T018 [US3] Synchronize favorite button visual state with active quote upon quote changes in `src/app.js`
- [X] T019 [P] [US3] Add visual styles for active and inactive favorite toggle states in `src/styles.css`

**Checkpoint**: All user stories complete; users can view, cycle, and persistently favorite quotes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, accessibility review, and end-to-end quality assurance.

- [X] T020 Run automated test suite with `npm test` to confirm all unit tests pass
- [X] T021 [P] Verify keyboard navigation (`Tab`, `Enter`, `Space`), screen reader attributes, and mobile responsiveness in `src/index.html` and `src/styles.css`
- [X] T022 Execute end-to-end verification scenarios defined in `specs/001-quote-of-the-day/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Delivers MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (enhances quote selection & button handler).
- **User Story 3 (Phase 5)**: Depends on User Story 1 & 2 completion (binds favorite state to active quote).
- **Polish (Phase 6)**: Depends on all user story phases being complete.

### User Story Dependencies

- **US1 (P1)**: Independent after Foundational phase.
- **US2 (P2)**: Integrates with US1 quote container and selection function.
- **US3 (P3)**: Integrates with US1/US2 display state and storage layer.

---

## Parallel Opportunities

- **Setup Phase**: T001 and T002 can be executed in parallel.
- **Foundational Phase**: T004 (mock storage) and T006 (storage tests) can proceed in parallel with T003/T005.
- **User Story 1**: T007 (test), T009 (HTML structure), and T010 (CSS) can be worked on concurrently before T011 (app wiring).
- **User Story 2**: T012 (repetition test) and T015 (button styles) can run in parallel with T013/T014.
- **User Story 3**: T016 (tests) and T019 (toggle styling) can run in parallel with T017/T018.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. Validate: Open `src/index.html` and verify an inspirational quote is displayed immediately.

### Incremental Delivery
1. Add User Story 2 (T012–T015): Enable on-demand quote cycling with repetition prevention.
2. Add User Story 3 (T016–T019): Enable persistent favorite toggling with `localStorage`.
3. Polish (T020–T022): Run full test suite and verify accessibility.
