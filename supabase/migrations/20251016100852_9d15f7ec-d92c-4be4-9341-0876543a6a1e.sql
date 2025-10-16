-- Update status column to support 'sent' status
ALTER TABLE public.drafts 
DROP CONSTRAINT IF EXISTS drafts_status_check;

ALTER TABLE public.drafts
ADD CONSTRAINT drafts_status_check CHECK (status IN ('draft', 'pending', 'reviewed', 'sent'));