import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnqrtnvmwutvcnqyiumq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNucXJ0bnZtd3V0dmNucXlpdW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTMwNDgsImV4cCI6MjA3NjA4OTA0OH0.YabEOGfWBKSJ4BWO4r47yVWaklLCQfU6o_N7cmRhXAY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
