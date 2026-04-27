create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('student', 'facilitator')),
  top_performer boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (name, role)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_id integer not null check (week_id between 1 and 8),
  type text not null,
  content jsonb not null default '{}'::jsonb,
  score integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  week_id integer not null check (week_id between 1 and 8),
  session_type text not null check (session_type in ('A', 'B')),
  is_active boolean not null default true,
  presentation_idx integer not null default 0,
  activity_title text,
  activity_body jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
drop trigger if exists submissions_set_updated_at on public.submissions;
drop trigger if exists live_sessions_set_updated_at on public.live_sessions;

create trigger submissions_set_updated_at
before update on public.submissions
for each row
execute function public.set_updated_at();

create trigger live_sessions_set_updated_at
before update on public.live_sessions
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.submissions enable row level security;
alter table public.live_sessions enable row level security;

drop policy if exists "public users read" on public.users;
drop policy if exists "public users insert" on public.users;
drop policy if exists "public users update" on public.users;
drop policy if exists "public submissions read" on public.submissions;
drop policy if exists "public submissions insert" on public.submissions;
drop policy if exists "public submissions update" on public.submissions;
drop policy if exists "public submissions delete" on public.submissions;
drop policy if exists "public live sessions read" on public.live_sessions;
drop policy if exists "public live sessions insert" on public.live_sessions;
drop policy if exists "public live sessions update" on public.live_sessions;
drop policy if exists "public live sessions delete" on public.live_sessions;

create policy "public users read" on public.users
for select
to anon, authenticated
using (true);

create policy "public users insert" on public.users
for insert
to anon, authenticated
with check (true);

create policy "public users update" on public.users
for update
to anon, authenticated
using (true)
with check (true);

create policy "public submissions read" on public.submissions
for select
to anon, authenticated
using (true);

create policy "public submissions insert" on public.submissions
for insert
to anon, authenticated
with check (true);

create policy "public submissions update" on public.submissions
for update
to anon, authenticated
using (true)
with check (true);

create policy "public submissions delete" on public.submissions
for delete
to anon, authenticated
using (true);

create policy "public live sessions read" on public.live_sessions
for select
to anon, authenticated
using (true);

create policy "public live sessions insert" on public.live_sessions
for insert
to anon, authenticated
with check (true);

create policy "public live sessions update" on public.live_sessions
for update
to anon, authenticated
using (true)
with check (true);

create policy "public live sessions delete" on public.live_sessions
for delete
to anon, authenticated
using (true);
