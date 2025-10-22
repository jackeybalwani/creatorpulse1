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

    console.log('Starting scheduled email delivery...');

    const now = new Date();

    // Get all drafts that are reviewed and scheduled for now or earlier
    const { data: drafts, error: draftsError } = await supabaseClient
      .from('drafts')
      .select('*')
      .eq('status', 'reviewed')
      .lte('scheduled_for', now.toISOString());

    if (draftsError) throw draftsError;

    console.log(`Found ${drafts?.length || 0} drafts ready to send`);

    const results = [];

    for (const draft of drafts || []) {
      // Get user preferences for email address
      const { data: userPref, error: prefError } = await supabaseClient
        .from('user_preferences')
        .select('email_address')
        .eq('user_id', draft.user_id)
        .single();

      if (prefError || !userPref) {
        console.log(`No preferences found for draft ${draft.id}`);
        continue;
      }

      const emailAddress = userPref.email_address;
      
      if (!emailAddress) {
        console.log(`No email address for draft ${draft.id}`);
        continue;
      }

      console.log(`Sending draft ${draft.id} to ${emailAddress}`);

      try {
        // Call send-newsletter function
        const { error: sendError } = await supabaseClient.functions.invoke(
          'send-newsletter',
          {
            body: {
              to: emailAddress,
              subject: draft.subject,
              content: draft.content
            }
          }
        );

        if (sendError) throw sendError;

        // Update draft status to sent
        const { error: updateError } = await supabaseClient
          .from('drafts')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', draft.id);

        if (updateError) throw updateError;

        results.push({ draft_id: draft.id, status: 'success' });
        console.log(`Draft ${draft.id} sent successfully`);

      } catch (error) {
        console.error(`Error sending draft ${draft.id}:`, error);
        results.push({ 
          draft_id: draft.id, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        emails_sent: results.filter(r => r.status === 'success').length,
        errors: results.filter(r => r.status === 'error').length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scheduled-email-sender:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
