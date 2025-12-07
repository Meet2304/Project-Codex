# Project Codex Constitution

## Core Principles

### I. Architecture: Modular Monolith, Clear Contracts
Build as a modular monolith first to minimize complexity and enable quick iteration. Separate concerns by layers (Domain, Application, Interface) and by modules (Auth, Users, Content). Each module must define a stable contract (types/schemas, request/response, events) and hide internals behind the contract.

### II. API-First (HTTP/JSON with OpenAPI)
Expose functionality via versioned RESTful HTTP endpoints returning JSON. Every public endpoint must be documented in an OpenAPI spec; error responses follow a unified error model. Backwards compatibility is maintained within a major version; breaking changes require a new version.

### III. Security & Authentication by Design
Authentication is mandatory for non-public endpoints. Prefer OpenID Connect (Authorization Code with PKCE) or session-backed auth with secure, HttpOnly cookies. Authorization follows role- or permission-based checks at the boundary. Secrets never live in code or VCS; configuration is environment-driven.

### IV. Test-First and Integration Coverage (NON-NEGOTIABLE)
Write tests before or alongside code. Unit tests cover domain logic. Integration tests cover database access, migrations, and critical flows (signup/login, session/token refresh, CRUD). Contract tests validate API schemas and auth enforcement. Aim for fast, reliable tests with ephemeral test databases.

### V. Observability, Versioning, and Simplicity
Structured logs with correlation IDs; minimal health, readiness, and metrics endpoints. Use Semantic Versioning. Prefer simple solutions first (YAGNI); introduce queues, caches, or microservices only when justified by measured need.

## Additional Constraints & Standards

- Technology Baseline: Relational database (e.g., PostgreSQL). An ORM or query builder is acceptable if it enforces migrations and type safety. HTTP backend using a mainstream framework. Web frontend may call the backend via the documented API.
- Database: All schema changes are migration-driven and version-controlled. No ad-hoc changes in shared environments. Transactions protect multi-step writes; enforce foreign keys and constraints. Seed data is idempotent and environment-scoped.
- Authentication & Authorization:
	- Primary: OIDC/OAuth 2.1 Authorization Code + PKCE for browser clients; server issues secure session cookie or validates tokens server-side.
	- Sessions/Cookies: Secure, HttpOnly, SameSite=Lax (or Strict for sensitive paths); CSRF protection for cookie-authenticated state-changing endpoints.
	- Minimum roles: user, admin. Admin-only endpoints are separate and audit-logged.
- Security: Input validation at the edge using shared schemas. Output escaping in UI. Apply least privilege to database users and cloud principals. Regular dependency and SAST scans. Secrets come from environment or secret manager.
- Configuration: 12-factor. All configuration via environment variables with sane defaults for local dev and strict checks in CI. No environment-specific code paths.
- Performance & Reliability: P99 latency SLOs defined per critical endpoint. Timeouts, retries (idempotent ops only), and circuit breakers at integration boundaries. Pagination for list endpoints; hard caps on payload size.
- Documentation: A single source of truth for OpenAPI; minimal README with run, test, migrate, and deploy instructions. Update docs when changing public behavior.

## Development Workflow & Quality Gates

- Branching & Reviews: `main` is protected. All changes via PR with at least one reviewer. PRs must link to issues and include migration notes if schema changes.
- CI Gates: Lint, type-check (if applicable), build, unit tests, integration tests (with ephemeral DB), OpenAPI validation, dependency audit, and minimal smoke test must pass.
- Database Changes: PR includes forward-only migration scripts and rollback notes. Apply migrations automatically on start in non-prod; explicit approval for prod.
- Versioning & Releases: Semantic Versioning. Tag releases. Breaking API changes require a major version and migration guide. Deprecations include timelines and warnings.
- Definition of Done: Code + tests + docs updated; logs and metrics added for new critical paths; feature toggles or migrations wired; CI green; reviewer approved.

## Governance

- This constitution supersedes ad-hoc practices. Exceptions require written rationale, risk assessment, and time-bounded mitigation in the PR.
- All PRs must demonstrate adherence to contracts (types/schemas), security controls (authz at boundaries), and test coverage. Complexity must be justified by measured need.
- Amendments: Propose changes via PR updating this document, with impact analysis and migration plan where relevant. Approval from maintainers required.
- Breaking changes policy: Avoid within a major version. If unavoidable, provide compatibility shims or documented migration and bump the major version.

**Version**: 1.0.0 | **Ratified**: 2025-10-01 | **Last Amended**: 2025-10-01