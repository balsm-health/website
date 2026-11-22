-- Applied to the project on 2026-11-22 as migration "lock_down_public_api".
-- Clears both Supabase security-advisor warnings and the waiting_list
-- over-exposure. The site only ever inserts through the public keys
-- (/api/waitlist, /api/newsletter); reading is for the service role.

-- 1. rls_auto_enable() is the ensure_rls event trigger's function (it turns on
--    RLS for new public tables). It runs as a trigger, never via the API, so
--    nobody needs EXECUTE on it through /rest/v1/rpc. Revoking does not stop
--    the event trigger from firing.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- 2. waiting_list: any signed-in user could read every waitlist email through
--    the "Authenticated read" policy, and the roles held far broader grants
--    (anon SELECT; authenticated UPDATE/DELETE/TRUNCATE/...) than they need.
drop policy if exists "Authenticated read" on public.waiting_list;
revoke all on public.waiting_list from anon, authenticated;
grant insert on public.waiting_list to anon, authenticated;
