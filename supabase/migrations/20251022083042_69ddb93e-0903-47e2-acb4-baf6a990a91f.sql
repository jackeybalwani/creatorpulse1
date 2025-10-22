-- Add trend_ids column to drafts table
ALTER TABLE public.drafts 
ADD COLUMN IF NOT EXISTS trend_ids TEXT[] DEFAULT '{}';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_drafts_trend_ids ON public.drafts USING GIN(trend_ids);