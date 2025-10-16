-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  writing_style TEXT DEFAULT 'Professional yet conversational',
  tone TEXT DEFAULT 'informative',
  length TEXT DEFAULT 'medium',
  delivery_time TEXT DEFAULT '08:00',
  email_address TEXT DEFAULT '',
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trends table
CREATE TABLE public.trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mentions INTEGER DEFAULT 0,
  sentiment NUMERIC DEFAULT 0,
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drafts table
CREATE TABLE public.drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for trends
CREATE POLICY "Users can view their own trends"
  ON public.trends FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trends"
  ON public.trends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trends"
  ON public.trends FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trends"
  ON public.trends FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for drafts
CREATE POLICY "Users can view their own drafts"
  ON public.drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
  ON public.drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON public.drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON public.drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON public.drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_trends_user_id ON public.trends(user_id);
CREATE INDEX idx_trends_detected_at ON public.trends(detected_at DESC);
CREATE INDEX idx_drafts_user_id ON public.drafts(user_id);
CREATE INDEX idx_drafts_created_at ON public.drafts(created_at DESC);