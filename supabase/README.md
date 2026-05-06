# Supabase

This folder contains the PostgreSQL schema and seed data for ScamRadar.

## Files

- `migrations/20260506010000_initial_schema.sql` creates the MVP tables, enums, indexes, vector column, moderation defaults, and basic RLS policies.
- `seeds/001_initial_data.sql` adds the initial scam categories and educational approved scam examples.

## Applying

Use the Supabase MCP `apply_migration` tool for DDL changes. Seed data can be applied with `execute_sql` after the migration is present.

Required project setting:

```bash
SUPABASE_PROJECT_ID=your-project-ref
```

