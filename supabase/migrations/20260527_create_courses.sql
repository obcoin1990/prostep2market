-- Migration: create public.courses table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

create table if not exists public.courses (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  description   text,
  level         text        check (level in ('beginner', 'intermediate', 'advanced', 'psychology')),
  module_number int,
  lesson_number int,
  content       jsonb,
  created_at    timestamp   default now(),
  updated_at    timestamp   default now()
);

-- Enable RLS (add policies as needed)
alter table public.courses enable row level security;

-- Allow authenticated users to read courses
create policy "courses_read_authenticated"
  on public.courses for select
  to authenticated
  using (true);

-- Reset PostgREST schema cache so the table is visible immediately via the REST API
notify pgrst, 'reload schema';
