-- Newsletter sign-ups from the site footer (POST /api/newsletter).
-- Applied on 2026-11-22 as migration "newsletter_subscribers" to both Balsm-Dev-Db
-- (ecsokheoaqbdrcenpgiy) and Prod (rkgeuweihteaflkiasue).
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

comment on table public.newsletter_subscribers is 'Newsletter sign-ups from the balsm.health footer. Insert-only for public keys; read with the service role.';

-- Insert-only for the public keys: nobody can read, change or delete
-- subscriber rows through them. The service role bypasses RLS for the upsert.
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

revoke all on public.newsletter_subscribers from anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
