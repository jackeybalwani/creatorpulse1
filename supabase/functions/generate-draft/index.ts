import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas
const trendSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  mentions: z.number().int().min(0).optional(),
  sentiment: z.number().min(-1).max(1).optional(),
});

const preferencesSchema = z.object({
  writingStyle: z.string().min(1).max(500).default("Clear, engaging, and informative"),
  tone: z.string().min(1).max(100).default("professional"),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  topics: z.array(z.string().max(100)).max(20).default(["AI", "Technology"]),
});

const generateDraftSchema = z.object({
  trends: z.array(trendSchema).min(1).max(20),
  preferences: preferencesSchema,
  subjectLine: z.string().max(200).optional(),
  pastNewsletters: z.array(z.object({
    content: z.string().max(10000)
  })).max(10).optional(),
});

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

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    // Validate input
    const body = await req.json();
    let validatedData;
    
    try {
      validatedData = generateDraftSchema.parse(body);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data', 
          details: validationError instanceof z.ZodError ? validationError.errors : 'Validation failed'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { trends, preferences, subjectLine, pastNewsletters = [] } = validatedData;
    console.log('Validated - Trends:', trends.length, 'items, Past newsletters:', pastNewsletters.length);

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Lovable AI key is not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare trends summary
    const trendsSummary = trends.slice(0, 5).map((t: any, i: number) => 
      `${i + 1}. ${t.title}: ${t.description} (${t.mentions} mentions, sentiment: ${t.sentiment})`
    ).join('\n');

    // Build style training context from past newsletters
    const styleContext = pastNewsletters.length > 0 
      ? `\n\nPast newsletter examples for style reference:\n${pastNewsletters.map((n: any, i: number) => 
          `Example ${i + 1}:\n${n.content.substring(0, 500)}...`
        ).join('\n\n')}`
      : '';

    const systemPrompt = `You are a professional newsletter writer specializing in enterprise-grade, visually appealing content. Create well-structured, scannable newsletters with clear sections, compelling headlines, and engaging formatting. ${styleContext ? 'Use the provided examples to match the writing style.' : ''}`;

    const userPrompt = `Write a newsletter draft based on these trending topics:

${trendsSummary}

Writing Style: ${preferences.writingStyle}
Tone: ${preferences.tone}
Length: ${preferences.length}
Focus Topics: ${preferences.topics.join(', ')}${styleContext}

Create an enterprise-grade newsletter with clean HTML fragment formatting:

1. **Subject Line**: ${subjectLine ? `Use this subject: "${subjectLine}"` : 'Create a compelling subject under 60 characters'}
2. **Opening Hook**: 1-2 sentence attention grabber
3. **Introduction**: Brief context paragraph (2-3 sentences)
4. **Main Content**: 3-4 trend sections, each with:
   - Bold headline with <h2>
   - 2-3 paragraph summary
   - Key insights as bullet points
   - Relevant link or CTA
5. **Commentary/Analysis**: Your expert take (1-2 paragraphs)
6. **Closing**: Strong CTA and sign-off

CRITICAL: Output ONLY HTML fragments, NOT a complete HTML document. Do NOT include <!DOCTYPE>, <html>, <head>, <body>, or <style> tags.

Use these HTML elements:
- <h2> for section headlines
- <p> for paragraphs
- <strong> or <b> for emphasis
- <ul> and <li> for bullet lists
- <a href="https://example.com"> for links
- <hr> for section dividers

Format your response as JSON:
{
  "subject": "Your subject line here",
  "content": "HTML fragment content starting with <p> tags, no doctype or html wrapper"
}`;

    console.log('Calling Lovable AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Lovable AI error:', response.status, error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate draft with Lovable AI', 
          details: error,
          status: response.status 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Lovable AI response:', JSON.stringify(data));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid Lovable AI response structure:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Lovable AI', details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const generatedText = data.choices[0].message.content;
    console.log('Generated text:', generatedText);

    // Function to clean and unescape content
    const cleanContent = (text: string): string => {
      return text
        // Remove literal escape sequences
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, ' ')
        .replace(/\\r/g, '')
        .replace(/\\\\/g, '\\')
        .replace(/\\"/g, '"')
        // Remove any remaining backslash-escaped characters
        .replace(/\\([^\\])/g, '$1')
        // Clean up excessive whitespace
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();
    };

    // Try to parse as JSON, fallback to text parsing
    let result;
    try {
      // First try to extract JSON from markdown code blocks if present
      let jsonText = generatedText;
      const codeBlockMatch = generatedText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      }
      
      const parsed = JSON.parse(jsonText);
      result = {
        subject: cleanContent(parsed.subject || 'Weekly Newsletter Update'),
        content: cleanContent(parsed.content || '')
      };
    } catch {
      // Fallback: extract subject and content from text
      const subjectMatch = generatedText.match(/"subject":\s*"([^"]+)"/);
      const contentMatch = generatedText.match(/"content":\s*"([\s\S]+?)"\s*\}/);
      
      result = {
        subject: cleanContent(subjectMatch?.[1] || 'Weekly Newsletter Update'),
        content: cleanContent(contentMatch?.[1] || generatedText)
      };
    }

    console.log('Returning draft:', result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-draft function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
