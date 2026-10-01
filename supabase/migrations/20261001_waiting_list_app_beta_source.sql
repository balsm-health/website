-- Allow the /download page's early-access form to tag its sign-ups.
--
-- The patient app's beta is not out yet, so balsm.health/download collects
-- emails for early access instead of sending people to a store. Those rows use
-- source = 'app_beta' so they can be invited separately from the Cloud and
-- providers waitlists.
--
-- Apply BEFORE deploying the website change that sends 'app_beta': until then
-- the CHECK constraint rejects those inserts and the form shows a generic error.

ALTER TABLE public.waiting_list
  DROP CONSTRAINT IF EXISTS waiting_list_source_check;

ALTER TABLE public.waiting_list
  ADD CONSTRAINT waiting_list_source_check
  CHECK (source = ANY (ARRAY['home'::text, 'cloud'::text, 'providers'::text, 'app_beta'::text]));
