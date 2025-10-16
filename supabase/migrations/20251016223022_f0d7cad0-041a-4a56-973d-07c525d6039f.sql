-- Add UPDATE policy for past_newsletters table
CREATE POLICY "Users can update their own past newsletters"
ON public.past_newsletters
FOR UPDATE
USING (auth.uid() = user_id);