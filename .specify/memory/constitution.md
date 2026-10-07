<!--
# Sync Impact Report
- Version change: 0.0.0 (template) → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Code Quality & Static Analysis Rigor
  - [PRINCIPLE_2_NAME] → II. Test-First & Comprehensive Test Coverage (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. Maintainability, Modularity & Loose Coupling
  - [PRINCIPLE_4_NAME] → IV. Simplicity, Clean Refactoring & Debt Prevention (YAGNI)
  - [PRINCIPLE_5_NAME] → V. Observable, Documented & Self-Describing Systems
- Added sections:
  - Quality Gates & Technical Constraints (formerly [SECTION_2_NAME])
  - Development Workflow & Verification Gates (formerly [SECTION_3_NAME])
- Removed sections: None
- Follow-up TODOs: None (all template placeholders fully resolved)
-->

# Spec-Kit Week 2 Constitution

## Core Principles

### I. Code Quality & Static Analysis Rigor
All production code MUST adhere to strict static analysis, formatting, and zero-warning policies under configured linters and type checkers.
- Production code MUST be explicit, readable, and idiomatic; implicit side-effects, monkey-patching, and dead code are forbidden.
- Functions and modules MUST enforce the Single Responsibility Principle (SRP) with cyclomatic complexity strictly constrained.
- Public interfaces, data contracts, and domain models MUST be strictly typed with no untyped fallbacks (e.g., no raw dynamic typing or untyped structures without boundary validation).
- Rationale: Predictable static checks, strict type safety, and clear module responsibilities eliminate runtime defect classes early, reduce cognitive review load, and preserve long-term maintainability.

### II. Test-First & Comprehensive Test Coverage (NON-NEGOTIABLE)
Test-Driven Development (TDD) and test-first specification are MANDATORY across all features and defect repairs.
- Red-Green-Refactor lifecycle is strictly enforced: Automated tests asserting expected behavior MUST be authored, reviewed, and observed failing before implementation begins.
- Every feature, contract change, and bug fix MUST include automated unit and integration tests covering positive paths, edge boundaries, and failure modes.
- Unit tests MUST be isolated, hermetic, and fast with zero out-of-process network or filesystem dependencies unless explicitly marked as an integration suite.
- Code coverage thresholds MUST be maintained (minimum 80% line and branch coverage across core business logic); pull requests causing coverage regressions MUST NOT be merged.
- Flaky tests are treated as critical defects; intermittent tests MUST be quarantined or resolved immediately.
- Rationale: Authoring tests first validates design intent before code commitment, prevents regression cycles, and provides the necessary safety net for continuous refactoring.

### III. Maintainability, Modularity & Loose Coupling
Architecture MUST enforce high cohesion and loose coupling across components and service boundaries.
- Domain and business logic MUST remain decoupled from external frameworks, delivery mechanisms, and transport layers.
- Dependencies MUST be explicitly injected; hidden global mutable state, ambient service locators, and hardcoded singletons are prohibited.
- Module boundaries MUST be strictly preserved: inter-module communication MUST traverse documented contracts, facades, or public interfaces.
- Systems MUST be designed to accommodate requirement changes without cascading modifications across unaffected components (Open/Closed Principle).
- Rationale: Modularity and decoupling prevent architectural rot, allow parallel component development, and ensure services can be maintained and replaced independently.

### IV. Simplicity, Clean Refactoring & Debt Prevention (YAGNI)
Engineers MUST implement the simplest viable design that completely satisfies approved specifications.
- Speculative abstractions, premature optimizations, and unnecessary indirection MUST NOT be introduced (You Aren't Gonna Need It).
- The Boy Scout Rule is mandatory: Engineers MUST leave modified code cleaner than they found it, performing focused, continuous refactoring without ballooning scope.
- Technical debt or pragmatic compromises MUST be explicitly tracked with an issue reference, owner, and resolution plan; unrecorded shortcuts are prohibited.
- Deprecated or dead code MUST be deleted immediately rather than kept commented out or preserved behind unused flags.
- Rationale: Accidental complexity compounds over time, slowing delivery velocity. Relentless simplicity and proactive code hygiene keep the maintenance footprint small.

### V. Observable, Documented & Self-Describing Systems
All software artifacts, APIs, and CLI tooling MUST be self-describing, observable, and fully documented.
- Public APIs, interfaces, and scripts MUST provide clear documentation, explicit type signatures, and actionable usage examples.
- Code MUST be self-documenting through expressive naming conventions; comments MUST explain non-obvious *why* rather than repeating *what*.
- Systems MUST emit structured, contextual telemetry and diagnostic log records with consistent severity levels.
- Error messages MUST be descriptive, providing context on what failed, the operational impact, and remediation guidance without leaking sensitive secrets.
- Rationale: Systems are maintained and debugged far more frequently than they are written. Transparent diagnostics and self-documenting code dramatically lower cognitive onboarding overhead and mean time to resolution (MTTR).

## Quality Gates & Technical Constraints

Engineering practices MUST satisfy the following non-negotiable gates:
- **Linting & Formatting Gate**: Automated formatting and linting suites MUST pass with zero errors in CI before any code review approval.
- **Automated CI Validation**: All automated unit, contract, and integration tests MUST pass cleanly in continuous integration pipelines. Merges on failing builds are forbidden.
- **Performance & Resource Standards**: Changes MUST NOT introduce asymptotic regressions in algorithmic complexity or unbounded memory leaks. Performance-sensitive paths require benchmark verification.
- **Security & Dependency Hygiene**: Third-party packages MUST pass automated vulnerability scans. Every new dependency MUST be scrutinized for licensing compliance, security posture, and necessity to prevent dependency bloat.

## Development Workflow & Verification Gates

The development lifecycle enforces verifiable quality at each phase:
- **Specification Traceability**: Every implementation PR MUST trace directly to an approved specification or task breakdown.
- **Peer Review Compliance**: Pull requests require at least one approving peer review verifying adherence to this Constitution, test coverage, and modular boundaries.
- **Defect Reproduction Gate**: Any reported bug MUST be accompanied by an automated regression test reproducing the issue prior to merging the corrective patch.
- **Refactoring Safety**: Refactoring PRs MUST NOT alter external functional behavior and MUST retain or improve existing test coverage.

## Governance

This Constitution serves as the foundational technical authority for the project:
- **Supremacy**: This Constitution supersedes informal team conventions, personal preferences, and unwritten guidelines. In any architectural disagreement or pull request debate, constitutional principles take precedence.
- **Amendment Procedure**:
  - Any team member may propose amendments via pull request.
  - Amendments require explicit review and approval by project maintainers with documented consensus.
  - Major amendments altering existing contracts or quality standards MUST include an architectural decision record (ADR) and migration plan.
- **Versioning Policy**:
  - The Constitution follows Semantic Versioning (MAJOR.MINOR.PATCH):
    - **MAJOR**: Breaking changes to governance structure, removal or fundamental weakening of existing principles.
    - **MINOR**: Addition of new principles, material expansion of technical quality gates or workflow constraints.
    - **PATCH**: Non-semantic clarifications, typographical fixes, and wording refinements.
- **Compliance & Enforcement**:
  - Adherence MUST be verified at all development gates, PR reviews, and Spec Kit workflow phases (`/speckit-plan`, `/speckit-checklist`, `/speckit-converge`).
  - Justified exceptions to any principle MUST be explicitly documented with formal maintainer approval.

**Version**: 1.0.0 | **Ratified**: 2026-10-07 | **Last Amended**: 2026-10-07
