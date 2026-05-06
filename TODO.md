# TODO.md - ScamRadar MVP

This checklist is based on `AGENTS.md` and `PRD.md`. The goal is to build the MVP in small, testable phases while keeping the product safety-focused, educational, and simple.

## Phase 1 - Project Foundation

- [x] Scaffold the project structure first.
  - Create the monorepo layout:
    - `apps/web` for the React + TypeScript frontend.
    - `apps/server` for the Node.js backend.
    - `packages/types` for shared TypeScript types.
    - `packages/shared` for shared validation/constants.
    - `docs` for product and architecture documentation.
  - Move or copy `PRD.md` and `AGENTS.md` into `docs` only if the repo structure decision is finalized. Deferred for now.
- [x] Choose the backend framework for MVP.
  - Default recommendation: Node.js + Express for faster MVP delivery.
  - Keep NestJS as a later option only if the backend becomes large enough to justify it.
- [x] Initialize frontend tooling.
  - Set up React, TypeScript, Vite, TailwindCSS, shadcn/ui, React Router, and TanStack Query.
  - Add base layout, routing shell, and responsive dark theme foundation.
- [x] Initialize backend tooling.
  - Set up TypeScript, Express, environment loading, request validation, error handling, and API routing.
  - Add health check endpoint.
- [x] Add workspace scripts.
  - Install dependencies from the repo root.
  - Add `dev`, `build`, `test`, `lint`, and `typecheck` scripts where appropriate.
- [x] Add baseline quality gates.
  - Configure formatting/linting.
  - Add minimal test setup for server routes and shared logic.
  - Ensure `npm run build` succeeds for initialized apps.

## Phase 2 - Data Model and Persistence

- [ ] Select PostgreSQL provider for development.
  - Options: local PostgreSQL, Supabase, or Neon.
- [ ] Choose database access layer.
  - Recommended: Prisma or Drizzle for typed schema and migrations.
- [ ] Create initial database schema.
  - `categories`
  - `scams`
  - `reports`
  - `ai_checks`
- [ ] Add scam status fields for moderation.
  - Support draft, pending, approved, and rejected states where needed.
- [ ] Add seed data.
  - Include initial categories such as Romance, Crypto, Banking, Job, Scholarship, Phishing, Marketplace, and Fake Support.
  - Add a few safe, educational sample scam entries.
- [ ] Add database validation tests.
  - Verify required fields.
  - Verify category relationships.
  - Verify moderation status defaults.

## Phase 3 - Backend API

- [ ] Implement public scam APIs.
  - `GET /scams`
  - `GET /scams/:slug`
  - `GET /categories`
- [ ] Implement search API.
  - Search by keyword, category, platform, country, and message phrase.
  - Keep initial search simple with database queries before adding vector search.
- [ ] Implement report submission API.
  - `POST /reports`
  - Validate title, category, description, and platform.
  - Sanitize user input.
  - Default reports to pending moderation.
- [ ] Add rate limiting.
  - Protect report submission and AI endpoints from spam or abuse.
- [ ] Add safe error handling.
  - Avoid leaking stack traces, secrets, or database details.
- [ ] Add API tests.
  - Cover scam listing, scam detail lookup, categories, report submission, validation failures, and rate-limited routes.

## Phase 4 - Frontend Public Experience

- [ ] Build the main app shell.
  - Navigation
  - Responsive layout
  - Dark modern UI foundation
  - Accessible typography and spacing
- [ ] Build the home page.
  - Hero section
  - AI scam checker entry point
  - Search bar
  - Featured scams
  - Educational highlights
- [ ] Build the scam library page.
  - List approved scam techniques.
  - Add filters for category, platform, and country.
  - Add keyword search.
- [ ] Build the scam detail page.
  - Show description, how it works, warning signs, example messages, prevention advice, recovery advice, and related scams.
- [ ] Build the report scam page.
  - Add required and optional fields from the PRD.
  - Warn users not to submit passwords, OTPs, card numbers, IDs, or banking credentials.
  - Show clear success and error states.
- [ ] Add frontend API services.
  - Centralize API calls in `services`.
  - Use TanStack Query for server state.
- [ ] Test responsive behavior.
  - Verify mobile, tablet, and desktop layouts.

## Phase 5 - AI Scam Checker and RAG

- [ ] Define AI safety rules in backend code.
  - The AI must not ask for credentials, OTPs, passwords, retaliation, or illegal scam execution.
  - The AI must explain uncertainty and recommend safe verification.
- [ ] Implement `POST /ai/check`.
  - Accept suspicious text or situation descriptions.
  - Validate and sanitize input.
  - Warn against sensitive data submission.
- [ ] Add initial non-vector risk analysis.
  - Detect urgency language, impersonation, money requests, credential requests, suspicious links, and emotional pressure.
  - Return a structured risk level, explanation, and safety recommendations.
- [ ] Add embeddings.
  - Choose AI provider and embedding model.
  - Store scam embeddings in PostgreSQL with pgvector or Supabase Vector.
- [ ] Add vector similarity search.
  - Retrieve similar scam entries for user input.
  - Include top matches in AI context.
- [ ] Build grounded AI response generation.
  - Return risk score, reasoning, similar scam matches, confidence notes, and next steps.
  - Avoid certainty guarantees.
- [ ] Log AI checks safely.
  - Store only what is necessary.
  - Avoid storing sensitive personal data where possible.
- [ ] Add AI endpoint tests.
  - Cover validation, safety restrictions, low/medium/high risk outputs, and retrieval behavior.

## Phase 6 - Admin and Moderation

- [ ] Add basic admin authentication.
  - Keep MVP simple but protect all admin routes.
- [ ] Implement admin report APIs.
  - `GET /admin/reports`
  - `PATCH /admin/reports/:id`
- [ ] Implement admin scam management APIs.
  - `POST /admin/scams`
  - Update and publish scam entries.
  - Manage moderation status.
- [ ] Build admin dashboard.
  - Show pending reports.
  - Show moderation counts.
  - Link to report review and scam editor.
- [ ] Build report review page.
  - Approve, reject, or convert report into a scam entry.
- [ ] Build scam editor.
  - Create and edit scam entries.
  - Manage categories, warning signs, examples, prevention steps, platform, country, and severity.
- [ ] Add admin tests.
  - Verify protected access.
  - Verify approval and rejection flows.

## Phase 7 - Security, Privacy, and Abuse Prevention

- [ ] Add input sanitization across all user-submitted fields.
- [ ] Add file upload rules if screenshots are supported.
  - Restrict file type and size.
  - Store in Cloudflare R2 or Supabase Storage.
  - Avoid public exposure of sensitive evidence by default.
- [ ] Add privacy copy near report and AI forms.
  - Tell users not to submit credentials, OTPs, card data, government IDs, or banking details.
- [ ] Review AI prompts for safety.
  - Ensure the assistant cannot generate scam execution instructions.
  - Ensure it does not encourage retaliation or doxxing.
- [ ] Add abuse monitoring basics.
  - Track rate-limited events.
  - Track repeated invalid submissions.

## Phase 8 - UX Polish and Content

- [ ] Refine the visual design.
  - Dark modern UI.
  - Calm cybersecurity-inspired style.
  - High readability.
  - Rounded cards without alarmist visuals.
- [ ] Improve empty, loading, and error states.
- [ ] Add educational guide pages.
  - Common warning signs.
  - How to verify suspicious messages.
  - What to do after sending money or credentials.
- [ ] Add related scam discovery.
  - Show related scams by category, platform, tags, or vector similarity.
- [ ] Improve search usability.
  - Highlight matched text.
  - Add clear no-results guidance.
- [ ] Run accessibility checks.
  - Keyboard navigation.
  - Form labels.
  - Contrast.
  - Focus states.

## Phase 9 - Deployment

- [ ] Choose deployment targets.
  - Frontend: Vercel or Netlify.
  - Backend: Render, Railway, or Fly.io.
  - Database: Supabase PostgreSQL or Neon.
- [ ] Create production environment variable documentation.
  - Database URL.
  - AI provider keys.
  - Storage credentials.
  - Admin auth secrets.
- [ ] Add deployment configuration.
  - Frontend build settings.
  - Backend start command.
  - Database migration command.
- [ ] Add production safety checks.
  - CORS.
  - Rate limits.
  - Secure headers.
  - Error logging.
- [ ] Run production build before launch.
- [ ] Smoke test deployed routes.
  - Home page.
  - Scam library.
  - Scam detail.
  - Report form.
  - AI check.
  - Admin login and moderation.

## Phase 10 - Post-MVP Improvements

- [ ] Add OCR screenshot analysis.
- [ ] Add URL scanner.
- [ ] Add browser extension.
- [ ] Add country-specific scam trend pages.
- [ ] Add public scam heatmaps.
- [ ] Add user accounts only if contribution or personalization needs justify them.
- [ ] Add stronger admin analytics and abuse dashboards.

## Current Assumptions

- The MVP should start as a simple monorepo using the structure suggested in the docs.
- Express is the default backend choice unless there is a clear reason to use NestJS.
- Search should start with regular database queries, then add vector search for RAG.
- Reports must be moderated before becoming public.
- The product should avoid storing sensitive personal data whenever possible.
