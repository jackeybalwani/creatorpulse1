-- Set up cron jobs for automated tasks

-- Sync sources every 6 hours
SELECT cron.schedule(
  'sync-sources-every-6-hours',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://cmqbmzsjassajujsdlfg.supabase.co/functions/v1/sync-sources',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJtenNqYXNzYWp1anNkbGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDgxOTQsImV4cCI6MjA3NjEyNDE5NH0.TccQnt7VuuaIQn6AFkDUKyAkkhgNOmSptEoDrOmo8Qw"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Generate drafts daily at 6 AM UTC
SELECT cron.schedule(
  'generate-drafts-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://cmqbmzsjassajujsdlfg.supabase.co/functions/v1/scheduled-draft-generator',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJtenNqYXNzYWp1anNkbGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDgxOTQsImV4cCI6MjA3NjEyNDE5NH0.TccQnt7VuuaIQn6AFkDUKyAkkhgNOmSptEoDrOmo8Qw"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Send scheduled emails every hour
SELECT cron.schedule(
  'send-scheduled-emails-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://cmqbmzsjassajujsdlfg.supabase.co/functions/v1/scheduled-email-sender',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJtenNqYXNzYWp1anNkbGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDgxOTQsImV4cCI6MjA3NjEyNDE5NH0.TccQnt7VuuaIQn6AFkDUKyAkkhgNOmSptEoDrOmo8Qw"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);