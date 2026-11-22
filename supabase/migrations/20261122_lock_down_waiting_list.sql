-- Applied to Prod (rkgeuweihteaflkiasue) on 2026-11-22 as migration
-- "lock_down_waiting_list". Dev got the equivalent in
-- 20261122_lock_down_public_api.sql.
--
-- waiting_list: the public (anon) key is embedded in the website, and the
-- "Allow public read of waiting_list" policy let anyone holding it read every
-- waitlist email. "Admin read" let any signed-in user do the same. The site
-- only ever inserts (/api/waitlist, no .select()); reading is for the service
-- role and the dashboard. Also drops the duplicate anon-only insert policy
-- ("Anyone can join waitlist" already covers anon) and cuts the public roles
-- down to INSERT.
drop policy if exists "Allow public read of waiting_list" on public.waiting_list;
drop policy if exists "Admin read" on public.waiting_list;
drop policy if exists "Allow public inserts to waiting_list" on public.waiting_list;
revoke all on public.waiting_list from anon, authenticated;
grant insert on public.waiting_list to anon, authenticated;
