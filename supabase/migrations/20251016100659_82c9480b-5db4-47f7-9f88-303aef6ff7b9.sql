-- Add sent_at column to drafts table
ALTER TABLE public.drafts 
ADD COLUMN sent_at TIMESTAMP WITH TIME ZONE;