-- Applied on 2026-11-22 as migration "waiting_list_newsletter_flag" to Prod
-- (rkgeuweihteaflkiasue) and Balsm-Dev-Db (ecsokheoaqbdrcenpgiy).
--
-- One table for both lists. A row is one person (email is UNIQUE):
--   newsletter = true            -> subscribed to the newsletter
--   source <> 'newsletter'       -> on the waitlist (home / cloud / providers)
--   source = 'newsletter'        -> newsletter only, not on the waitlist
alter table public.waiting_list add column if not exists newsletter boolean not null default false;
comment on column public.waiting_list.newsletter is 'Subscribed to the newsletter. Rows with source = newsletter are newsletter-only (not on the waitlist).';

alter table public.waiting_list drop constraint if exists waiting_list_source_check;
alter table public.waiting_list add constraint waiting_list_source_check
  check (source = any (array['home', 'cloud', 'providers', 'newsletter']));
comment on column public.waiting_list.source is 'Which form the signup came from: home, cloud, providers, or newsletter (newsletter-only, not on the waitlist).';

-- Sign-ups go through this function so a second sign-up for the same email
-- merges into the existing row (subscribe sets the flag; joining the waitlist
-- upgrades a newsletter-only row) without giving the public key UPDATE on the
-- table, which would let anyone overwrite any row by guessing an email. It
-- only ever touches these columns, and validates its own input.
create or replace function public.join_list(
  p_email text,
  p_list text,
  p_locale text default 'ar',
  p_source text default 'home',
  p_message text default null,
  p_organization text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_locale text := case when p_locale in ('ar', 'en') then p_locale else 'ar' end;
  v_source text := case when p_source in ('home', 'providers') then p_source else 'home' end;
  v_message text := nullif(left(trim(coalesce(p_message, '')), 2000), '');
  v_org text := nullif(left(trim(coalesce(p_organization, '')), 200), '');
begin
  if v_email is null or char_length(v_email) > 254 or v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;

  if p_list = 'newsletter' then
    insert into public.waiting_list (email, locale, source, newsletter)
    values (v_email, v_locale, 'newsletter', true)
    on conflict (email) do update set newsletter = true;
  elsif p_list = 'waitlist' then
    insert into public.waiting_list (email, locale, source, message, organization)
    values (v_email, v_locale, v_source, v_message, v_org)
    on conflict (email) do update set
      source = case when public.waiting_list.source = 'newsletter' then excluded.source else public.waiting_list.source end,
      locale = excluded.locale,
      message = coalesce(excluded.message, public.waiting_list.message),
      organization = coalesce(excluded.organization, public.waiting_list.organization);
  else
    raise exception 'invalid list' using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.join_list(text, text, text, text, text, text) from public;
grant execute on function public.join_list(text, text, text, text, text, text) to anon, authenticated;

-- Fold the short-lived separate newsletter table in, then drop it.
do $$
begin
  if to_regclass('public.newsletter_subscribers') is not null then
    insert into public.waiting_list (email, locale, source, newsletter, created_at)
    select email, locale, 'newsletter', true, created_at from public.newsletter_subscribers
    on conflict (email) do update set newsletter = true;
    drop table public.newsletter_subscribers;
  end if;
end $$;
