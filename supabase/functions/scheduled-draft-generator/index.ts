import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting scheduled draft generation...');

    // Get all users with preferences
    const { data: preferences, error: prefsError } = await supabaseClient
      .from('user_preferences')
      .select('*');

    if (prefsError) throw prefsError;

    console.log(`Found ${preferences?.length || 0} users to generate drafts for`);

    const results = [];

    for (const pref of preferences || []) {
      console.log(`Generating draft for user: ${pref.user_id}`);

      try {
        // Get user's trends
        const { data: trends, error: trendsError } = await supabaseClient
          .from('trends')
          .select('*')
          .eq('user_id', pref.user_id)
          .order('detected_at', { ascending: false })
          .limit(10);

        if (trendsError) throw trendsError;

        if (!trends || trends.length === 0) {
          console.log(`No trends found for user ${pref.user_id}`);
          continue;
        }

        // Get past newsletters for style training
        const { data: pastNewsletters } = await supabaseClient
          .from('past_newsletters')
          .select('content')
          .eq('user_id', pref.user_id)
          .order('sent_date', { ascending: false })
          .limit(3);

        // Call generate-draft function
        const { data: draftData, error: draftError } = await supabaseClient.functions.invoke(
          'generate-draft',
          {
            body: {
              trends,
              preferences: pref,
              pastNewsletters: pastNewsletters || []
            }
          }
        );

        if (draftError) throw draftError;

        // Calculate scheduled time (tomorrow at user's preferred delivery time)
        const scheduledFor = new Date();
        scheduledFor.setDate(scheduledFor.getDate() + 1);
        const [hours, minutes] = pref.delivery_time.split(':');
        scheduledFor.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Insert draft
        const { error: insertError } = await supabaseClient
          .from('drafts')
          .insert({
            user_id: pref.user_id,
            subject: draftData.subject,
            content: draftData.content,
            status: 'draft',
            scheduled_for: scheduledFor.toISOString(),
          });

        if (insertError) throw insertError;

        results.push({ user_id: pref.user_id, status: 'success' });
        console.log(`Draft generated successfully for user ${pref.user_id}`);

      } catch (error) {
        console.error(`Error generating draft for user ${pref.user_id}:`, error);
        results.push({ 
          user_id: pref.user_id, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        drafts_generated: results.filter(r => r.status === 'success').length,
        errors: results.filter(r => r.status === 'error').length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scheduled-draft-generator:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
