# PRD.md — Scam Awareness & AI Scam Detection Platform

## Product Name

Working Name: ScamRadar

Alternative names:

- ScamWatch
- FraudLens
- ScamCheck
- VerifyFirst
- ScamGuard

---

# 1. Product Overview

ScamRadar is a web platform designed to educate users about modern scam techniques and help them identify potentially fraudulent messages, situations, or requests using AI-powered analysis.

The platform combines:

- A structured scam techniques database
- Community-submitted scam reports
- An AI RAG chatbot that analyzes suspicious situations
- Educational resources and warning signs

The goal is to help users recognize scams before becoming victims.

The platform is designed to be:

- Lightweight
- Fast
- Privacy-focused
- Easy to contribute to
- AI-enhanced
- Searchable and educational

---

# 2. Core Problem

Scams evolve rapidly across:

- WhatsApp
- Instagram
- Email
- SMS
- Telegram
- Facebook Marketplace
- Fake job boards
- Fake scholarship offers
- Crypto communities
- Banking impersonation
- Romance scams

Most users:

- Do not recognize patterns
- Cannot distinguish legitimate requests from scams
- Are manipulated emotionally or urgently
- Need quick verification

There is currently no centralized, easy-to-use system specifically focused on:

- Scam pattern education
- AI scam analysis
- Community-driven reporting
- Pattern matching against known scams

---

# 3. Goals

## Primary Goals

### 1. Scam Awareness

Teach users how modern scams work.

### 2. Scam Detection

Allow users to check suspicious situations using AI.

### 3. Community Reporting

Allow users to submit new scam techniques.

### 4. Centralized Scam Knowledge Base

Build a growing searchable database of scam patterns.

### 5. Privacy-Conscious AI Analysis

Allow analysis without requiring dangerous personal data.

---

# 4. Non-Goals

The platform is NOT:

- A banking platform
- A law enforcement platform
- A payment processor
- A marketplace
- A dark web investigation platform
- A scammer database exposing private identities

The platform should NOT:

- Store sensitive credentials
- Request OTPs/passwords
- Encourage vigilantism
- Teach illegal scam execution methods

---

# 5. Target Users

## Primary Users

### Students

- Fake scholarship scams
- Admission scams
- Internship scams

### Young Professionals

- Fake remote jobs
- Crypto investment scams
- Fake recruiters

### General Internet Users

- Phishing
- Fake giveaways
- Fake customer care
- Marketplace scams

### Elderly Users

- Tech support scams
- Banking impersonation
- Emergency scams

---

# 6. User Stories

## Scam Search

As a user, I want to search scam techniques so I can verify suspicious situations.

## AI Scam Check

As a user, I want to paste suspicious messages and receive an AI-based scam analysis.

## Scam Reporting

As a user, I want to report new scams to help others avoid them.

## Educational Browsing

As a user, I want to learn common warning signs and scam patterns.

## Similar Scam Matching

As a user, I want the AI to compare my situation against known scams.

---

# 7. Core Features

# 7.1 Scam Techniques Library

A structured public database of scam patterns.

## Features

### Categories

- Romance scams
- Job scams
- Crypto scams
- Investment scams
- Scholarship scams
- Banking scams
- Phishing
- Fake support scams
- Marketplace scams
- Delivery scams
- Social engineering scams

### Each Scam Page Includes

- Scam title
- Description
- How the scam works
- Common warning signs
- Example scam phrases/messages
- Emotional manipulation techniques used
- Platforms commonly used
- Typical victim targets
- Prevention advice
- Recovery advice
- Related scams

---

# 7.2 AI Scam Checker

Core intelligent system of the platform.

Users paste:

- Messages
- Emails
- Situations
- Screenshots converted to text
- Conversation summaries

The AI analyzes:

- Urgency language
- Emotional manipulation
- Requests for money
- Requests for OTP/passwords
- Suspicious links
- Impersonation attempts
- Similar scam patterns

## AI Output

The AI should produce:

- Scam Risk Score
- Explanation
- Similar Scam Matches
- Safety Recommendations
- Confidence Notes

---

# 7.3 Community Scam Reporting

Users can submit scam techniques.

## Submission Fields

### Required

- Scam title
- Scam category
- Description
- Platform used

### Optional

- Screenshot
- Country/region
- Scam message text
- Contact email

## Moderation Flow

1. User submits report
2. Admin reviews
3. Admin approves/rejects
4. Approved scam enters public database

---

# 7.4 Search System

Users should be able to search:

- Scam names
- Keywords
- Phrases
- Platforms
- Countries
- Scam categories

---

# 8. AI + RAG Architecture

## RAG Overview

1. User submits suspicious text
2. Backend embeds the text
3. Vector search retrieves similar scams
4. Retrieved scams are inserted into AI context
5. AI generates grounded analysis

---

# 9. Privacy & Safety

## Sensitive Data Restrictions

Users should be warned NOT to submit:

- Passwords
- OTPs
- Card numbers
- Government IDs
- Banking credentials

---

# 10. Technical Architecture

## Frontend

- React
- TypeScript
- TailwindCSS
- shadcn/ui

## Backend

- Node.js + Express
  OR
- NestJS

## Database

- PostgreSQL

## Vector Database

- pgvector
  OR
- Supabase Vector

## AI Providers

- OpenAI
- Gemini
- Claude

---

# 11. Database Schema

## scams

```sql
id
title
slug
category_id
description
how_it_works
warning_signs
example_messages
prevention_steps
severity
country
platform
embedding
status
created_at
updated_at
```

## categories

```sql
id
name
slug
description
```

## reports

```sql
id
title
category_id
description
message_text
platform
country
screenshot_url
contact_email
status
created_at
```

## ai_checks

```sql
id
input_text
risk_level
ai_response
matched_scams
created_at
```

---

# 12. Admin Dashboard

Admin system for:

- Reviewing reports
- Approving/rejecting scams
- Editing scam entries
- Managing categories
- Monitoring abuse

---

# 13. UX Principles

The app should feel:

- Calm
- Trustworthy
- Clean
- Educational
- Non-sensational

---

# 14. MVP Scope

## Included in MVP

- Scam library
- Scam detail pages
- AI scam checker
- Scam reporting
- Admin moderation
- Search system
- RAG retrieval
- Responsive UI

## Excluded From MVP

- Browser extension
- Mobile apps
- Real-time scanning
- Automatic URL crawling
- User reputation system
- Social/community feeds

---

# 15. Final Vision

ScamRadar aims to become a centralized intelligence and education platform for modern scams.

The long-term vision is to create:

- A living scam knowledge base
- AI-assisted scam analysis
- Community-driven scam awareness
- Safer digital interactions for everyday users
