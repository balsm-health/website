-- Help center forms on balsm.health/support (Support.dc.html):
--   POST /api/support/contact → public.submit_support_message
--   POST /api/support/delete  → public.request_account_deletion
--
-- NOT YET APPLIED. Apply to Balsm-Dev-Db (ecsokheoaqbdrcenpgiy) and Prod
-- (rkgeuweihteaflkiasue) before deploying the page, or both forms answer 500.
--
-- The website cannot send email, so nothing here confirms or deletes anything
-- on its own: the team reads these tables with the service role, replies from
-- contact@balsm.health, and confirms each deletion request by email before
-- deleting the account in the app backend. The page's copy says exactly that.
--
-- Same shape as join_list: the public keys get no table access at all, only
-- EXECUTE on one SECURITY DEFINER function per form, which validates and caps
-- every field (the API route does too; this is the backstop). Refused input
-- raises 22023, which the routes turn into a 400.

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 254),
  name text check (name is null or char_length(name) <= 120),
  subject text not null check (subject in ('bug', 'account', 'privacy', 'idea', 'other')),
  device text check (device is null or char_length(device) <= 120),
  message text not null check (char_length(message) between 10 and 2000),
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  status text not null default 'new' check (status in ('new', 'answered', 'closed')),
  created_at timestamptz not null default now()
);

comment on table public.support_messages is 'Contact / problem reports from balsm.health/support. Written only through submit_support_message; read with the service role.';

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 254),
  reason text check (reason is null or char_length(reason) <= 1000),
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'deleted', 'rejected')),
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

comment on table public.account_deletion_requests is 'Account deletion requests from balsm.health/support (the web deletion route app stores ask for). Written only through request_account_deletion; confirmed by email and processed by the team.';

-- One open request per address: a second submit is a no-op, not a new row.
create unique index if not exists account_deletion_requests_one_pending
  on public.account_deletion_requests (email) where status = 'pending';

alter table public.support_messages enable row level security;
alter table public.account_deletion_requests enable row level security;
revoke all on public.support_messages from anon, authenticated;
revoke all on public.account_deletion_requests from anon, authenticated;

create or replace function public.submit_support_message(
  p_email text,
  p_message text,
  p_subject text default 'other',
  p_name text default null,
  p_device text default null,
  p_locale text default 'ar'
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_message text := trim(coalesce(p_message, ''));
  v_subject text := case when p_subject in ('bug', 'account', 'privacy', 'idea', 'other') then p_subject else 'other' end;
  v_locale text := case when p_locale in ('ar', 'en') then p_locale else 'ar' end;
begin
  if v_email is null or char_length(v_email) > 254 or v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;
  if char_length(v_message) < 10 then
    raise exception 'message too short' using errcode = '22023';
  end if;
  insert into public.support_messages (email, name, subject, device, message, locale)
  values (
    v_email,
    nullif(left(trim(coalesce(p_name, '')), 120), ''),
    v_subject,
    case when v_subject = 'bug' then nullif(left(trim(coalesce(p_device, '')), 120), '') end,
    left(v_message, 2000),
    v_locale
  );
end;
$$;

create or replace function public.request_account_deletion(
  p_email text,
  p_reason text default null,
  p_locale text default 'ar'
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if v_email is null or char_length(v_email) > 254 or v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;
  insert into public.account_deletion_requests (email, reason, locale)
  values (
    v_email,
    nullif(left(trim(coalesce(p_reason, '')), 1000), ''),
    case when p_locale in ('ar', 'en') then p_locale else 'ar' end
  )
  on conflict (email) where status = 'pending' do nothing;
end;
$$;

revoke execute on function public.submit_support_message(text, text, text, text, text, text) from public;
revoke execute on function public.request_account_deletion(text, text, text) from public;
grant execute on function public.submit_support_message(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.request_account_deletion(text, text, text) to anon, authenticated;
