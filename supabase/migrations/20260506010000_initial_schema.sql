create extension if not exists pgcrypto;
create extension if not exists vector;

create type public.risk_level as enum ('low', 'medium', 'high', 'unknown');
create type public.scam_status as enum ('draft', 'pending', 'approved', 'rejected');
create type public.report_status as enum ('pending', 'approved', 'rejected');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.scams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  description text not null,
  how_it_works text not null,
  warning_signs text[] not null default '{}',
  example_messages text[] not null default '{}',
  prevention_steps text[] not null default '{}',
  recovery_steps text[] not null default '{}',
  emotional_triggers text[] not null default '{}',
  related_scam_slugs text[] not null default '{}',
  severity public.risk_level not null default 'unknown',
  country text,
  platform text,
  status public.scam_status not null default 'draft',
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scams_title_length check (char_length(trim(title)) >= 3),
  constraint scams_slug_length check (char_length(trim(slug)) >= 3),
  constraint scams_description_length check (char_length(trim(description)) >= 20)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category_id uuid references public.categories(id) on delete set null,
  description text not null,
  message_text text,
  platform text not null,
  country text,
  screenshot_url text,
  contact_email text,
  status public.report_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reports_title_length check (char_length(trim(title)) >= 3),
  constraint reports_description_length check (char_length(trim(description)) >= 20),
  constraint reports_platform_length check (char_length(trim(platform)) >= 2)
);

create table public.ai_checks (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  risk_level public.risk_level not null default 'unknown',
  ai_response jsonb not null default '{}'::jsonb,
  matched_scams jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint ai_checks_input_text_length check (char_length(trim(input_text)) >= 10)
);

create index categories_slug_idx on public.categories(slug);
create index scams_category_id_idx on public.scams(category_id);
create index scams_status_idx on public.scams(status);
create index scams_platform_idx on public.scams(platform);
create index scams_country_idx on public.scams(country);
create index scams_title_trgm_idx on public.scams using gin (to_tsvector('english', title || ' ' || description));
create index reports_status_idx on public.reports(status);
create index reports_category_id_idx on public.reports(category_id);
create index ai_checks_risk_level_idx on public.ai_checks(risk_level);

create index scams_embedding_idx
  on public.scams
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100)
  where embedding is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger scams_set_updated_at
before update on public.scams
for each row execute function public.set_updated_at();

create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.scams enable row level security;
alter table public.reports enable row level security;
alter table public.ai_checks enable row level security;

create policy "Public can read categories"
on public.categories for select
using (true);

create policy "Public can read approved scams"
on public.scams for select
using (status = 'approved');

create policy "Public can submit reports"
on public.reports for insert
with check (status = 'pending');

