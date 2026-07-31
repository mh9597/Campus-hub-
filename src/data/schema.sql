-- =============================================================================
-- Student Resource Hub — Secure Database Schema
-- Backend Proxy Pattern: All access via Edge Functions
-- =============================================================================

-- Drop existing tables to ensure clean slate (in production, use migrations carefully)
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.opportunities CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.resource_requests CASCADE;
DROP TABLE IF EXISTS public.resource_uploads CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.semesters CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: departments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.departments (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: semesters
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.semesters (
  id smallint primary key,
  department_id smallint not null references public.departments(id),
  semester_number smallint not null,
  name text not null,
  description text,
  bg_color text,
  pin_color text,
  rotate text default '0deg',
  sort_order smallint not null,
  unique (department_id, semester_number)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: subjects
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.subjects (
  id uuid primary key default gen_random_uuid(),
  semester_id smallint not null references public.semesters(id) on delete cascade,
  code text not null unique,
  title text not null,
  description text,
  bg_color text,
  pin_color text,
  rotate text default '0deg',
  icon text,
  card_type text,
  path text,
  sort_order smallint default 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: resources
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.resources (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  description text,
  resource_type text not null check (resource_type in ('notes','previous_year_papers','practical_file','viva_questions','question_bank','syllabus','lab_manual','other')),
  url text,
  file_path text,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: opportunities
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('internships','hackathons','scholarships','coding','workshops','remote','online','general')),
  emoji text default '⭐',
  tag text,
  tag_type text default 'tertiary',
  rotate text default '0deg',
  pin_bg text,
  is_active boolean not null default false,
  submitter_email text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: announcements
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.announcements (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  badge text,
  color text,
  deadline timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: resource_requests
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.resource_requests (
  id uuid primary key default gen_random_uuid(),
  subject_code text,
  resource_type text,
  message text not null,
  requester_email text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','resolved')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: resource_uploads
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.resource_uploads (
  id uuid primary key default gen_random_uuid(),
  subject_code text,
  resource_type text,
  title text not null,
  description text,
  url text not null,
  contributor_email text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_uploads ENABLE ROW LEVEL SECURITY;

-- Note: No public policies are created.
-- All access to these tables must go through Edge Functions which use the service_role key.
