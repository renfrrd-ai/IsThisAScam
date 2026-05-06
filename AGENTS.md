# AGENTS.md — ScamRadar AI Building Context

# Project Name

ScamRadar

AI-powered scam awareness and scam detection platform.

---

# Project Summary

ScamRadar is a web platform that helps users:
- Learn scam techniques
- Search scam patterns
- Report scams
- Use an AI assistant to analyze suspicious situations

The system combines:
- Structured scam databases
- Community reporting
- Retrieval-Augmented Generation (RAG)
- AI-based risk analysis

The app is educational and safety-focused.

It is NOT a hacking platform or a system for exposing private identities.

---

# Product Vision

Create a centralized intelligence and education platform for modern internet scams.

The long-term goal is to:
- Build a living scam database
- Detect scam patterns using AI
- Help users verify suspicious situations
- Improve scam awareness globally

---

# Core Principles

## 1. Safety First

The platform must:
- Encourage caution
- Promote safe internet practices
- Avoid harmful instructions
- Protect user privacy

The AI must NEVER:
- Ask for passwords
- Ask for OTPs
- Encourage retaliation
- Teach illegal scam execution

---

## 2. Educational Tone

The platform should feel:
- Calm
- Professional
- Helpful
- Informative
- Non-sensational

Avoid:
- Fear-mongering
- Alarmist design
- Excessive danger language

---

## 3. Simplicity

The system should:
- Be lightweight
- Be easy to navigate
- Focus on core features
- Avoid feature overload in MVP

---

# Core Features

## Scam Library

Public database of scam techniques.

Each scam entry contains:
- Title
- Description
- Warning signs
- Scam flow
- Example messages
- Prevention advice
- Related scams

---

## AI Scam Checker

Users paste:
- Messages
- Emails
- Scam descriptions
- Suspicious situations

The AI analyzes:
- Urgency language
- Emotional manipulation
- Requests for money
- Impersonation patterns
- Similar scams from the database

The AI outputs:
- Risk level
- Explanation
- Similar scams
- Safety recommendations

---

## Scam Reporting

Users can submit scam reports.

Reports require moderation before publication.

---

## Search System

Users should search by:
- Scam type
- Platform
- Keywords
- Countries
- Message phrases

---

# Technical Stack

# Frontend

- React
- TypeScript
- TailwindCSS
- shadcn/ui
- React Router
- TanStack Query

---

# Backend

Recommended:
- Node.js
- Express
OR
- NestJS

---

# Database

- PostgreSQL

Main storage for:
- Scam entries
- Categories
- Reports
- AI checks
- Admin moderation

---

# Vector Search

- pgvector
OR
- Supabase Vector

Used for:
- Semantic similarity search
- RAG retrieval

---

# AI Providers

Possible providers:
- OpenAI
- Gemini
- Claude

---

# File Storage

For screenshots/evidence:
- Cloudflare R2
OR
- Supabase Storage

---

# Architecture Overview

## High-Level Flow

1. User submits suspicious text
2. Backend generates embeddings
3. Vector search retrieves similar scams
4. Retrieved scams are injected into AI context
5. AI generates analysis
6. Frontend displays result

---

# RAG Pipeline

## Step 1 — User Input

User submits:
- Scam message
- Situation description
- Email text
- Conversation text

---

## Step 2 — Embedding Generation

Backend converts text into embeddings.

---

## Step 3 — Similarity Search

Search vector database for:
- Similar scam patterns
- Similar messages
- Related scam categories

---

## Step 4 — Context Assembly

Backend builds AI context from:
- Top scam matches
- Warning signs
- Scam descriptions

---

## Step 5 — AI Response

AI generates:
- Risk assessment
- Reasoning
- Similar scam references
- Safety advice

---

# Important AI Rules

## AI MUST

- Explain reasoning
- Reference known scam patterns
- Encourage verification
- Recommend caution
- Handle uncertainty properly

---

## AI MUST NEVER

- Guarantee certainty
- Reveal sensitive data
- Request credentials
- Encourage illegal activity
- Generate scam instructions

---

# Database Design

## scams

Stores approved scam techniques.

Fields:
- id
- title
- slug
- category_id
- description
- warning_signs
- example_messages
- prevention_steps
- severity
- country
- platform
- embedding
- created_at

---

## reports

Stores user-submitted reports.

Fields:
- id
- title
- description
- message_text
- screenshot_url
- status
- created_at

---

## categories

Stores scam categories.

Examples:
- Romance
- Crypto
- Banking
- Job
- Scholarship
- Phishing

---

## ai_checks

Stores optional AI analysis logs.

---

# Frontend Pages

## Public Pages

### Home Page
Contains:
- Hero section
- AI scam checker
- Search bar
- Featured scams
- Educational sections

---

### Scam Library Page
List/search scam techniques.

---

### Scam Detail Page
Detailed breakdown of a scam.

---

### Report Scam Page
Form for submitting scam reports.

---

### Educational Pages
Guides and awareness content.

---

# Admin Pages

### Admin Dashboard
Moderation overview.

### Reports Review
Approve/reject reports.

### Scam Editor
Create/edit scam entries.

---

# UI/UX Direction

## Design Style

- Dark modern UI
- Minimal interface
- High readability
- Cybersecurity-inspired visuals
- Clean spacing
- Rounded cards

---

## UX Priorities

- Fast search
- Simple navigation
- Trustworthy feel
- Mobile responsiveness
- Clear explanations

---

# MVP Priorities

Build in this order:

## Phase 1
- Project setup
- Database schema
- Backend API
- Scam CRUD

---

## Phase 2
- Frontend pages
- Scam browsing
- Search system

---

## Phase 3
- AI scam checker
- Embeddings
- RAG retrieval

---

## Phase 4
- Report moderation
- Admin dashboard

---

## Phase 5
- UI polishing
- Optimization
- Deployment

---

# Suggested Folder Structure

```txt
/apps
  /web
  /server

/packages
  /ui
  /types
  /shared

/docs
  PRD.md
  AGENTS.md
```

---

# Backend Structure

```txt
src/
  modules/
    scams/
    reports/
    ai/
    auth/
    admin/
    search/

  services/
  db/
  middleware/
  utils/
```

---

# Frontend Structure

```txt
src/
  pages/
  components/
  layouts/
  hooks/
  services/
  lib/
  store/
```

---

# API Design Direction

## Scam APIs

- GET /scams
- GET /scams/:slug
- POST /reports
- GET /categories

---

## AI APIs

- POST /ai/check
- POST /ai/embed

---

## Admin APIs

- GET /admin/reports
- PATCH /admin/reports/:id
- POST /admin/scams

---

# Security Considerations

## Rate Limiting
Prevent spam/AI abuse.

---

## Input Sanitization
Prevent XSS and malicious uploads.

---

## Moderation
All reports require approval.

---

## Privacy
Do not store highly sensitive information.

---

# Deployment

## Frontend
- Vercel
OR
- Netlify

---

## Backend
- Railway
- Render
- Fly.io

---

## Database
- Supabase PostgreSQL
OR
- Neon

---

# Long-Term Expansion

Possible future additions:
- Browser extension
- URL scanner
- Email scanner
- OCR screenshot analysis
- Mobile apps
- Scam heatmaps
- Country-specific scam trends

---

# Final Notes For AI Coding Agents

Focus on:
- Simplicity
- Scalability
- Safety
- Good architecture
- Fast iteration
- Clean modular code

Avoid:
- Overengineering
- Premature optimization
- Complex microservices in MVP

The MVP should prioritize:
1. Scam database
2. Search
3. AI scam checker
4. Moderation
5. Good UX
