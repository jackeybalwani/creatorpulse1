import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    // Fetch active sources for authenticated user only
    const { data: sources, error: sourcesError } = await supabaseClient
      .from('sources')
      .select('*')
      .eq('is_active', true)
      .eq('user_id', user.id);

    if (sourcesError) throw sourcesError;

    console.log(`Found ${sources?.length || 0} active sources to sync`);

    const trends: any[] = [];

    for (const source of sources || []) {
      console.log(`Syncing source: ${source.name} (${source.type})`);
      
      // Update sync status
      await supabaseClient
        .from('sources')
        .update({ 
          sync_status: 'syncing',
          last_sync_at: new Date().toISOString()
        })
        .eq('id', source.id);

      try {
        // Fetch content based on source type
        let content: Array<{ title: string; description: string }> = [];
        
        if (source.type === 'rss') {
          content = await fetchRSSFeed(source.url);
        } else if (source.type === 'youtube') {
          content = await fetchYouTubeChannel(source.url);
        } else if (source.type === 'twitter') {
          content = await fetchTwitterHandle(source.url);
        }

        console.log(`Fetched ${content.length} items from ${source.name}`);

        // Analyze content for trends
        const detectedTrends = await analyzeTrends(content, source.user_id);
        trends.push(...detectedTrends);

        // Update source with success
        await supabaseClient
          .from('sources')
          .update({ 
            sync_status: 'success',
            tracked_count: content.length,
            sync_error: null
          })
          .eq('id', source.id);

      } catch (error) {
        console.error(`Error syncing ${source.name}:`, error);
        await supabaseClient
          .from('sources')
          .update({ 
            sync_status: 'error',
            sync_error: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', source.id);
      }
    }

    // Insert detected trends
    if (trends.length > 0) {
      const { error: trendsError } = await supabaseClient
        .from('trends')
        .insert(trends);
      
      if (trendsError) {
        console.error('Error inserting trends:', trendsError);
      } else {
        console.log(`Inserted ${trends.length} new trends`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sources_synced: sources?.length || 0,
        trends_detected: trends.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-sources:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchRSSFeed(url: string) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse RSS feed (basic implementation)
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
    return items.map(item => {
      const title = item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const description = item.match(/<description>(.*?)<\/description>/)?.[1] || '';
      return { title, description };
    });
  } catch (error) {
    console.error('RSS fetch error:', error);
    return [];
  }
}

async function fetchYouTubeChannel(url: string) {
  // For MVP, we'll use public RSS feed from YouTube
  try {
    const channelId = url.split('/').pop() || '';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    return await fetchRSSFeed(rssUrl);
  } catch (error) {
    console.error('YouTube fetch error:', error);
    return [];
  }
}

async function fetchTwitterHandle(handle: string) {
  // For MVP, we'll return simulated data (Twitter API requires paid access)
  // In production, you'd integrate with Twitter API v2
  console.log('Twitter sync - simulated for MVP');
  return [];
}

async function analyzeTrends(content: any[], userId: string) {
  if (!content.length) return [];

  // Basic trend detection: group by keywords
  const keywords = new Map<string, { count: number, descriptions: string[] }>();
  
  content.forEach(item => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    const words = text.split(/\s+/).filter(w => w.length > 5);
    
    words.forEach(word => {
      if (!keywords.has(word)) {
        keywords.set(word, { count: 0, descriptions: [] });
      }
      const data = keywords.get(word)!;
      data.count++;
      if (data.descriptions.length < 3) {
        data.descriptions.push(item.title);
      }
    });
  });

  // Convert top keywords to trends
  const trends = Array.from(keywords.entries())
    .filter(([_, data]) => data.count >= 3) // Minimum 3 mentions
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([keyword, data]) => ({
      user_id: userId,
      title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      description: `Trending topic detected across ${data.count} posts`,
      mentions: data.count,
      sentiment: 0.5,
      category: 'General',
    }));

  return trends;
}
