-- Newsletter sign-ups from the site footer (POST /api/newsletter).
-- Separate from waiting_list: that table is UNIQUE(email) and CHECKs `source`,
-- so a newsletter row there would overwrite or be rejected alongside a
-- waitlist row for the same person.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254),
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  page text check (page is null or char_length(page) <= 121),
  created_at timestamptz not null default now()
);

-- Insert-only for the public (anon) key: nobody can read, change or delete
-- subscriber rows through it. The service role bypasses RLS for the upsert.
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anon can subscribe" on public.newsletter_subscribers;
create policy "anon can subscribe" on public.newsletter_subscribers
  for insert to anon with check (true);
