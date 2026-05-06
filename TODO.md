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

- [x] Select PostgreSQL provider for development.
  - Options: local PostgreSQL, Supabase, or Neon.
  - Selected: Supabase PostgreSQL.
  - Applied against Supabase project `ScamRadar`.
- [x] Choose database access layer.
  - Recommended: Prisma or Drizzle for typed schema and migrations.
  - Selected for MVP: Supabase JS client with SQL migrations to keep the stack light.
- [x] Create initial database schema.
  - `categories`
  - `scams`
  - `reports`
  - `ai_checks`
  - Local migration created and applied remotely through Supabase MCP.
- [x] Add scam status fields for moderation.
  - Support draft, pending, approved, and rejected states where needed.
- [x] Add seed data.
  - Include initial categories such as Romance, Crypto, Banking, Job, Scholarship, Phishing, Marketplace, and Fake Support.
  - Add a few safe, educational sample scam entries.
- [x] Add database validation tests.
  - Verify required fields.
  - Verify category relationships.
  - Verify moderation status defaults.

## Phase 3 - Backend API

- [x] Implement public scam APIs.
  - `GET /scams`
  - `GET /scams/:slug`
  - `GET /categories`
- [x] Implement search API.
  - Search by keyword, category, platform, country, and message phrase.
  - Keep initial search simple with database queries before adding vector search.
- [x] Implement report submission API.
  - `POST /reports`
  - Validate title, category, description, and platform.
  - Sanitize user input.
  - Default reports to pending moderation.
- [x] Add rate limiting.
  - Protect report submission and AI endpoints from spam or abuse.
- [x] Add safe error handling.
  - Avoid leaking stack traces, secrets, or database details.
- [x] Add API tests.
  - Cover scam listing, scam detail lookup, categories, report submission, validation failures, and rate-limited routes.

## Phase 4 - Frontend Public Experience

- [x] Build the main app shell.
   - Navigation
   - Responsive layout
   - Light modern UI foundation
   - Toggle Dark and Light Mode, Moderm UI
   - Accessible typography and spacing
- [x] Build the home page.
   - Hero section
   - AI scam checker entry point
   - Search bar
   - Featured scams
   - Educational highlights
- [x] Build the scam library page.
   - List approved scam techniques.
   - Add filters for category, platform, and country.
   - Add keyword search.
- [x] Build the scam detail page.
   - Show description, how it works, warning signs, example messages, prevention advice, recovery advice, and related scams.
- [x] Build the report scam page.
   - Add required and optional fields from the PRD.
   - Warn users not to submit passwords, OTPs, card numbers, IDs, or banking credentials.
   - Show clear success and error states.
- [x] Add frontend API services.
   - Centralize API calls in `services`.
   - Use TanStack Query for server state.
- [ ] Test responsive behavior.
   - Verify mobile, tablet, and desktop layouts.

## Phase 5 - AI Scam Checker and RAG

- [x] Define AI safety rules in backend code.
   - The AI must not ask for credentials, OTPs, passwords, retaliation, or illegal scam execution.
   - The AI must explain uncertainty and recommend safe verification.
- [x] Implement `POST /ai/check`.
   - Accept suspicious text or situation descriptions.
   - Validate and sanitize input.
   - Warn against sensitive data submission.
- [x] Add initial non-vector risk analysis.
   - Detect urgency language, impersonation, money requests, credential requests, suspicious links, and emotional pressure.
   - Return a structured risk level, explanation, and safety recommendations.
- [x] Add embeddings.
   - Choose AI provider and embedding model.
   - Store scam embeddings in PostgreSQL with pgvector (Supabase Vector).
- [x] Add vector similarity search.
   - Retrieve similar scam entries for user input.
   - Include top matches in AI context.
- [x] Build grounded AI response generation.
   - Return risk score, reasoning, similar scam matches, confidence notes, and next steps.
   - Avoid certainty guarantees.
- [x] Log AI checks safely.
   - Store only what is necessary.
   - Avoid storing sensitive personal data where possible.
- [x] Add AI endpoint tests.
   - Cover validation, safety restrictions, low/medium/high risk outputs, and retrieval behavior.

## Phase 6 - Admin and Moderation

- [x] Add basic admin authentication.
   - Keep MVP simple but protect all admin routes.
- [x] Implement admin report APIs.
   - `GET /admin/reports`
   - `PATCH /admin/reports/:id`
- [x] Implement admin scam management APIs.
   - `POST /admin/scams`
   - Update and publish scam entries.
   - Manage moderation status.
- [x] Build admin dashboard.
   - Show pending reports.
   - Show moderation counts.
   - Link to report review and scam editor.
- [x] Build report review page.
   - Approve, reject, or convert report into a scam entry.
- [x] Build scam editor.
   - Create and edit scam entries.
   - Manage categories, warning signs, examples, prevention steps, platform, country, and severity.
- [x] Add admin tests.
   - Verify protected access.
   - Verify approval and rejection flows.

## Phase 7 - Security, Privacy, and Abuse Prevention

- [x] Add input sanitization across all user-submitted fields.
   - HTML tag removal, dangerous character filtering.
   - Enhanced validation schemas.
- [x] Add file upload rules if screenshots are supported.
   - Restrict file type and size.
   - Store in Cloudflare R2 or Supabase Storage.
   - Avoid public exposure of sensitive evidence by default.
- [x] Add privacy copy near report and AI forms.
   - Tell users not to submit credentials, OTPs, card data, government IDs, or banking details.
   - Sensitive data detection patterns implemented.
- [x] Review AI prompts for safety.
   - Ensure the assistant cannot generate scam execution instructions.
   - Ensure it does not encourage retaliation or doxxing.
   - AI safety rules defined in ai-safety.ts.
- [x] Add abuse monitoring basics.
   - Track rate-limited events.
   - Track repeated invalid submissions.
   - Rate limiting middleware in place.
   - Sensitive data detection logging.

## Phase 8 - UX Polish and Content

- [x] Refine the visual design.
  - Dark modern UI.
  - Calm cybersecurity-inspired style.
  - High readability.
  - Rounded cards without alarmist visuals.
- [x] Improve empty, loading, and error states.
- [x] Add educational guide pages.
  - Common warning signs.
  - How to verify suspicious messages.
  - What to do after sending money or credentials.
- [x] Add related scam discovery.
  - Show related scams by category, platform, tags, or vector similarity.
- [x] Improve search usability.
  - Highlight matched text.
  - Add clear no-results guidance.
- [x] Run accessibility checks.
  - Keyboard navigation.
  - Form labels.
  - Contrast.
  - Focus states.

## Phase 9 - Scam Types Expansion

- [x] Add a dedicated scam types browsing page.
  - Create a public `/scam-types` route in the web app.
  - Add the route to the main desktop and mobile navigation.
  - Show scam type cards with name, short description, risk focus, and common platforms.
  - Link each card to `/library?category=<slug>` so users can browse the filtered library.
  - Include a clear empty state for scam types that do not yet have approved scam entries.
- [x] Expand the scam category set beyond the current MVP examples.
  - Keep existing categories: Romance, Crypto, Banking, Job, Scholarship, Phishing, Marketplace, and Fake Support.
  - Add categories for recovery scams, investment scams, government or tax scams, rental scams, charity scams, business invoice or BEC scams, loan and debt scams, prize or lottery scams, travel or ticket scams, social media impersonation, malware, and remote access scams.
  - Give every category a stable slug, plain-language description, and non-alarmist educational framing.
  - Avoid duplicate categories where one existing category already covers the same user intent.
- [x] Add approved sample scam entries for the expanded categories.
  - Add at least one safe, educational seed scam per new high-priority category.
  - Include title, slug, category, description, how it works, warning signs, example messages, prevention steps, recovery steps, emotional triggers, severity, platform, and optional country.
  - Keep example messages realistic enough for education without becoming a playbook for running scams.
  - Include recovery scam content that warns users that online hackers or fake authorities cannot guarantee fund recovery.
- [x] Verify scam type filtering end to end.
  - Confirm `/scam-types` links apply the correct library category filter.
  - Confirm `/library` still supports keyword, category, platform, country, and phrase filters.
  - Confirm category names render correctly on scam cards and scam details.
  - Add or update tests where route, API, or seed behavior changes.

## Phase 10 - Guides and Victim-Advising Content

- [x] Fix guide routing and guide data consistency.
  - Remove the duplicate `/guides/:slug` route definition.
  - Ensure `App.tsx` uses the real guide detail page implementation.
  - Move guide metadata/content into one shared source used by both the guides index and detail page.
  - Make sure every guide card links to an existing detail slug.
- [x] Add an `Advising Potential Victims` guide.
  - Focus the guide on family members, friends, partners, coworkers, and caregivers who suspect someone is being scammed.
  - Use a calm, practical, non-judgmental tone.
  - Explain that victims may be embarrassed, defensive, emotionally attached, isolated, financially pressured, or convinced that outsiders do not understand.
  - Include advice for starting the conversation without attacking the victim's intelligence or character.
  - Include steps for gathering evidence safely, encouraging a pause on payments, contacting banks or platforms, and escalating to authorities when money or identity data is involved.
  - Include guidance for romance scams, investment scams, job scams, recovery scams, fake support scams, and family-emergency impersonation scams.
  - Include what not to do: do not shame, threaten, secretly take over accounts unless safety requires it, confront the scammer directly, or pay more money to prove the scam.
- [x] Improve guide content quality and structure.
  - Keep headings scannable and action-oriented.
  - Add links from relevant guides to the resources page, report page, AI checker, and scam library.
  - Ensure all guide safety copy says ScamRadar is educational and cannot guarantee whether something is legitimate.
  - Preserve the dark modern UI style and readable mobile layout.
- [x] Verify guide behavior.
  - Test `/guides` and every guide detail route.
  - Confirm unknown slugs show the guide-not-found state.
  - Confirm guide content does not request passwords, OTPs, banking credentials, government IDs, or other sensitive data.

## Phase 11 - Resources Directory

- [x] Add a public resources page.
  - Create a `/resources` route and navigation entry or prominent link from guides/how-it-works.
  - Add a short "new victims, start here" section based on the provided reference, rewritten to be general and not Reddit-specific.
  - State that if a user suspects a site, message, investment, or contact is a scam, they should pause and verify before sending money or information.
  - Explain that legitimate organizations do not force withdrawal fees, taxes, or advance payments to release funds.
  - Warn that recovery scams often target people after an initial scam.
  - Tell victims to contact their bank, payment provider, platform, and law enforcement quickly when money, identity data, or account access is involved.
- [ ] Add core country resource filtering first.
  - Add a country/region dropdown with United States, Canada, United Kingdom, EU/Europe, Australia, and Global.
  - Add a scam-type dropdown that maps resources to broad types such as phishing, investment, crypto, banking, job, marketplace, malware, identity theft, and general fraud.
  - Show matching resource cards with authority name, country/region, scam type tags, when to use it, and external link.
  - Make it clear that resources are starting points, not legal advice.
- [ ] Compile official and authoritative resources for the first version.
  - United States: FTC ReportFraud, FBI IC3, local FBI field offices, SEC, CFTC, FinCEN where relevant.
  - Canada: Canadian Anti-Fraud Centre, Competition Bureau guidance, local police, bank/payment provider reporting.
  - United Kingdom: Action Fraud for England/Wales/Northern Ireland, Police Scotland guidance, NCSC phishing resources.
  - EU/Europe: Europol cybercrime reporting directory and country-specific law-enforcement portals where available.
  - Australia: Scamwatch, ReportCyber, IDCARE, ASIC where relevant.
  - Global: Google Safe Browsing phishing report, Google malware report, Google spam/deceptive webpage report, platform abuse reports, domain lookup education.
  - Prefer official government, regulator, law-enforcement, major platform, or recognized victim-support resources.
- [ ] Prepare resources data for future AI/RAG matching.
  - Store resources in a structured frontend data module or shared package rather than hardcoded JSX.
  - Include fields for id, title, country, region, scam types, description, use case, urgency level, url, source organization, and last reviewed date.
  - Keep copy concise enough to be embedded later for semantic search.
  - Do not build the AI resource-matching tool in this phase unless it is separately prioritized.
- [x] Verify resources behavior.
  - Confirm country and scam-type filters work together.
  - Confirm external links open safely and use official URLs.
  - Confirm the page remains useful when no exact country/type match exists by showing global resources.
  - Add tests or data validation if resource structure becomes shared application data.

## Phase 12 - How ScamRadar Works Page

- [ ] Add a public `/how-it-works` page.
  - Explain the scam library, scam types, search, AI scam checker, reporting, resources, and guides.
  - Explain that ScamRadar is educational and safety-focused, not law enforcement, legal advice, financial advice, or a guaranteed scam verdict system.
  - Explain that AI analysis uses warning signs, known scam patterns, and similar scam retrieval when configured.
  - Explain that users should not submit passwords, OTPs, card numbers, government IDs, private keys, seed phrases, or full banking credentials.
- [ ] Explain report moderation.
  - Describe that public reports require review before publication.
  - Explain moderators check for scam patterns, duplicate reports, unsafe personal information, harmful accusations, and whether the submission can be turned into an educational scam entry.
  - State that moderators do not guarantee recovery, investigate like police, expose private identities, or contact alleged scammers on behalf of users.
  - Include a simple flow: submit report, moderation queue, review, approve/reject/convert, public education update.
- [ ] Add community moderator call-to-action.
  - Add a "Be a Moderator" link or button.
  - Link to the moderator application page.
  - State clearly that becoming a moderator has no fee and is community service.
  - Explain that applicants should be comfortable handling sensitive stories responsibly.
- [ ] Verify the page content and navigation.
  - Link from the homepage, footer, guides, or resources where appropriate.
  - Confirm the page fits mobile and desktop layouts.
  - Confirm no copy overpromises accuracy, recovery, investigation, or official authority.

## Phase 13 - Moderator Application and Community Review Flow

- [ ] Add a public moderator application page.
  - Create a `/moderator-application` route.
  - Keep the form short enough to complete in 2-3 minutes.
  - Explain that moderation is unpaid community service and there is no fee to apply or serve.
  - Explain that applicants should not submit highly sensitive personal data.
  - Add success, error, loading, and validation states.
- [ ] Include the required application questions.
  - Ask whether the applicant or someone close to them has been affected by a scam.
  - Ask why they want to help moderate ScamRadar reports.
  - Ask whether they understand moderators review reports, protect privacy, avoid harmful accusations, and help turn reports into educational information.
  - Ask whether they understand there is no fee associated with being a moderator.
  - Ask whether they have helped a potential or direct scam victim before, what they did, and what happened even if the person was eventually scammed.
  - Ask what scam areas they know best.
  - Ask what country or region they can best help with.
  - Ask how they would handle a report containing private information.
  - Ask how much time they can realistically contribute each week.
- [ ] Add backend persistence for moderator applications.
  - Add a `moderator_applications` database table and migration.
  - Include applicant name or display name, contact email, country/region, experience answers, motivation answer, scam-area interests, weekly availability, status, reviewer notes, created_at, and updated_at.
  - Add status values such as pending, reviewing, accepted, rejected, and archived.
  - Add row-level security policies consistent with the rest of the Supabase schema.
  - Do not store unnecessary sensitive victim details.
- [ ] Add public moderator application API.
  - Add `POST /moderator-applications`.
  - Validate and sanitize all text fields.
  - Add rate limiting to prevent spam.
  - Return a safe success response without exposing internal review details.
  - Add shared request/response types where useful.
- [ ] Prepare admin review support.
  - Make the stored application shape admin-review-ready even if the admin UI is built later.
  - Optionally add protected admin list/detail/status endpoints if needed for the first moderation workflow.
  - Ensure reviewer notes are never public.
- [ ] Verify moderator application behavior.
  - Add API tests for valid submissions, invalid submissions, and rate limiting.
  - Confirm frontend form validation matches backend validation.
  - Confirm submitted applications default to pending.
  - Confirm no payment, fee, or credential fields exist.

## Phase 14 - Deployment

- [x] Choose deployment targets.
  - Frontend: Vercel or Netlify.
  - Backend: Render, Railway, or Fly.io.
  - Database: Supabase PostgreSQL or Neon.
- [x] Create production environment variable documentation.
  - Database URL.
  - AI provider keys.
  - Storage credentials.
  - Admin auth secrets.
- [x] Add deployment configuration.
  - Frontend build settings (`vercel.json`).
  - Backend start command (`render.yaml`).
  - Database migration command.
- [x] Add production safety checks.
  - CORS with allowed origins.
  - Rate limits.
  - Secure headers via Helmet.
  - Error logging with Morgan.
- [x] Run production build before launch.
- [x] Smoke test deployed routes.
  - Home page.
  - Scam library.
  - Scam detail.
  - Report form.
  - AI check.
  - Admin login and moderation.

## Phase 15 - Post-MVP Improvements

- [x] Country-specific scam trends.
  - `/trends` page showing scam statistics by country.
  - Severity breakdown (high/medium/low) per country.
  - Top categories per country.
- [ ] Public scam heatmaps.
  - Visual map showing scam density by region.
  - Filter by scam type and time period.
- [ ] OCR screenshot analysis.
  - Extract text from scam screenshots.
  - Feed into AI checker for analysis.
- [ ] URL scanner.
  - Check URLs against phishing databases.
  - Show safety ratings for links.
- [ ] Browser extension.
  - Detect scam patterns on web pages.
  - Show warnings for suspicious sites.
- [ ] User accounts (if needed).
  - Personal scam reporting history.
  - Save favorite guides and resources.
- [ ] Advanced admin analytics.
  - Scam trend analysis over time.
  - Report processing metrics.
  - User engagement statistics.

## Summary

### Completed
- ✓ Phase 1: Project Foundation
- ✓ Phase 2: Data Model and Persistence
- ✓ Phase 3: Backend API
- ✓ Phase 4: Frontend Public Experience
- ✓ Phase 5: AI Scam Checker and RAG
- ✓ Phase 6: Admin and Moderation
- ✓ Phase 7: Security, Privacy, and Abuse Prevention
- ✓ Phase 8: UX Polish and Content
- ~ Phase 14: Deployment (partially complete - docs done, smoke tests pending)

### Key Features Implemented
- Scam library with search and filtering
- AI-powered scam checker with RAG
- User reporting system with moderation
- Admin dashboard for content management
- Educational guides
- Light/dark theme toggle
- Responsive design
- Security: input sanitization, rate limiting, sensitive data detection

### Next Steps
1. Complete Phase 9: Scam Types Expansion
2. Complete Phase 10: Guides and Victim-Advising Content
3. Complete Phase 11: Resources Directory
4. Complete Phase 12: How ScamRadar Works Page
5. Complete Phase 13: Moderator Application and Community Review Flow
6. Complete Phase 14: Deploy to production and smoke test
7. Plan Phase 15 features based on priorities

## Current Assumptions

- The MVP should start as a simple monorepo using the structure suggested in the docs.
- Express is the default backend choice unless there is a clear reason to use NestJS.
- Search should start with regular database queries, then add vector search for RAG.
- Reports must be moderated before becoming public.
- The product should avoid storing sensitive personal data whenever possible.
- Completed TODO items should remain visible so the roadmap keeps implementation history.
- The new content/resource/moderator work should land before deployment because it changes the MVP product surface.
