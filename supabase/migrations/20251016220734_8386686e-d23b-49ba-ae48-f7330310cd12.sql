-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Table to store past newsletters for writing style training
CREATE TABLE IF NOT EXISTS public.past_newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_date TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.past_newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own past newsletters" 
ON public.past_newsletters 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own past newsletters" 
ON public.past_newsletters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own past newsletters" 
ON public.past_newsletters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Table to store feedback and edit tracking
CREATE TABLE IF NOT EXISTS public.draft_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_id UUID NOT NULL,
  user_id UUID NOT NULL,
  original_subject TEXT,
  edited_subject TEXT,
  original_content TEXT,
  edited_content TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  edit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.draft_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback" 
ON public.draft_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" 
ON public.draft_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Table to store sources with sync tracking
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('twitter', 'youtube', 'rss')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tracked_count INTEGER NOT NULL DEFAULT 0,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT CHECK (sync_status IN ('pending', 'syncing', 'success', 'error')),
  sync_error TEXT,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sources" 
ON public.sources 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sources" 
ON public.sources 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sources" 
ON public.sources 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sources" 
ON public.sources 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updating updated_at on sources
CREATE TRIGGER update_sources_updated_at
BEFORE UPDATE ON public.sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add scheduled_for column to drafts if not exists (for scheduled delivery)
ALTER TABLE public.drafts 
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;