-- Add UPDATE and DELETE policies for draft_feedback table
CREATE POLICY "Users can update their own feedback"
ON public.draft_feedback
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
ON public.draft_feedback
FOR DELETE
USING (auth.uid() = user_id);