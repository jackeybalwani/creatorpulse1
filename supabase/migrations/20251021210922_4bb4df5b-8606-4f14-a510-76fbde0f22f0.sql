-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant permissions to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule draft generation (daily at 6 AM)
SELECT cron.schedule(
  'scheduled-draft-generator',
  '0 6 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://cmqbmzsjassajujsdlfg.supabase.co/functions/v1/scheduled-draft-generator',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJtenNqYXNzYWp1anNkbGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDgxOTQsImV4cCI6MjA3NjEyNDE5NH0.TccQnt7VuuaIQn6AFkDUKyAkkhgNOmSptEoDrOmo8Qw"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Schedule email sender (every 15 minutes)
SELECT cron.schedule(
  'scheduled-email-sender',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://cmqbmzsjassajujsdlfg.supabase.co/functions/v1/scheduled-email-sender',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJtenNqYXNzYWp1anNkbGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDgxOTQsImV4cCI6MjA3NjEyNDE5NH0.TccQnt7VuuaIQn6AFkDUKyAkkhgNOmSptEoDrOmo8Qw"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Schedule source sync (every 6 hours)
SELECT cron.schedule(
  'sync-sources',
  '0 */6 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://cmqbmzsjassajujsdlfg.supabase.co/functions/v1/sync-sources',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJtenNqYXNzYWp1anNkbGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDgxOTQsImV4cCI6MjA3NjEyNDE5NH0.TccQnt7VuuaIQn6AFkDUKyAkkhgNOmSptEoDrOmo8Qw"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);