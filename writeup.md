# Week 2 Assignment Writeup: Spec Kit Workflow

## Prompts Used

The following Spec Kit commands were executed in sequence:

### Constitution
- `/speckit-constitution Create principles focused on code quality, testing, and maintainability.`
Established guiding principles for code quality, testing, maintainability, and implementation consistency.

### Specification
- `/speckit-specify A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads.`
Created the initial feature specification with user stories, functional requirements, and acceptance criteria.

### Plan
- `/speckit-plan Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage.`
Defined the technical approach using plain HTML, CSS, and JavaScript with no backend and localStorage for favorite persistence.

### Tasks
- `/speckit-tasks`
Converted the specification and plan into an ordered set of development tasks.

### Implementation
- `/speckit-implement`
Implemented the generated tasks and produced the working Quote of the Day application and automated tests.

### Convergence
- `/speckit-converge`
Checked the implementation against the specification, plan, tasks, and constitution for remaining gaps.

## Specification Refinement

### Exact Refinement Prompt Used
> "Refine the specification to stay strictly within the requested scope. Remove the dedicated 'Saved Favorites View' and any requirements or acceptance criteria that depend on a separate favorites section. The page should only display one quote at a time, provide a 'New quote' button, and allow the currently displayed quote to be marked or unmarked as a favorite. Favorite state must persist across reloads. Do not add features beyond these requirements."

### Before / After Refinement
- **Before**: The initial specification added an unrequested P4 "Saved Favorites View" with additional requirements and acceptance criteria for browsing and removing quotes in a dedicated section.
- **Refinement**: The specification was reviewed and the dedicated favorites view and its related requirements were removed because they were outside the requested scope.
- **After**: The specification was limited to displaying one quote at a time, a "New quote" button, favoriting/unfavoriting the displayed quote, and preserving favorite state across reloads.

## Convergence Outcome

`/speckit-converge` reported **"Converged"** with no implementation gaps:
- **Tasks**: All 22 tasks across Phases 1 through 6 were completed and marked `[X]`.
- **Tests**: All 18 automated tests passed cleanly across 5 test suites (covering catalog integrity, random selection with predecessor exclusion, `localStorage` persistence, error/quota recovery, and end-to-end integration).
- **Findings**: 0 gaps identified across functional requirements, user stories, acceptance criteria, plan architectural decisions, and constitutional principles.

The final implementation therefore matched the refined specification and required no further implementation/convergence iteration.

## What I Learned

Through this assignment, I learned what Spec Kit is and how it can be used together with a coding agent. At first, defining the specification, rules, requirements, and constraints before starting the implementation felt like some extra overhead for such a small application, but I saw how these steps helped keep the agent and the final implementation aligned with the intended outcome. I also gained a basic understanding of the steps required to build a system with an agent and how the implementation should be verified through different tests before it is considered complete. Overall, this process helped me better understand the concept of “intent” discussed in class and how that intent can be systematically translated into an actual implementation.