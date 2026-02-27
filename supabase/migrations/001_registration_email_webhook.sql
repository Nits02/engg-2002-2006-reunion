-- ============================================================
-- SQL: Database Webhook Trigger for Registration Emails
-- ============================================================
-- Run this in the Supabase SQL Editor to create a database
-- webhook that fires the Edge Function on every new registration.
--
-- IMPORTANT: Replace <YOUR_PROJECT_REF> with your Supabase
-- project reference (e.g. "abcdefghijklmnop").
-- ============================================================

-- Option A: Use Supabase Dashboard (recommended, no SQL needed)
--   1. Go to Database → Webhooks → Create a new webhook
--   2. Name: send-registration-email
--   3. Table: registrations
--   4. Events: INSERT
--   5. Type: Supabase Edge Function
--   6. Edge Function: send-registration-email
--   7. Save

-- Option B: Use pg_net extension (SQL approach)
-- Make sure the pg_net extension is enabled first:

CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_function_url text;
  service_role_key  text;
  payload           jsonb;
BEGIN
  -- 🔒 Replace these with your actual values, or better yet
  -- store them in vault and retrieve with vault.decrypted_secrets
  edge_function_url := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/send-registration-email';
  
  -- Retrieve service_role key from Supabase Vault (recommended)
  -- If you stored it as 'service_role_key' in the vault:
  -- SELECT decrypted_secret INTO service_role_key
  --   FROM vault.decrypted_secrets
  --   WHERE name = 'service_role_key';
  
  -- Or hardcode for testing (NOT recommended for production):
  service_role_key := '<YOUR_SERVICE_ROLE_KEY>';

  -- Build the webhook payload matching the standard format
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', row_to_json(NEW)::jsonb,
    'old_record', NULL
  );

  -- Fire the Edge Function asynchronously via pg_net
  PERFORM net.http_post(
    url     := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body    := payload
  );

  RETURN NEW;
END;
$$;

-- Create the trigger on the registrations table
DROP TRIGGER IF EXISTS on_registration_insert ON public.registrations;

CREATE TRIGGER on_registration_insert
  AFTER INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_registration();
