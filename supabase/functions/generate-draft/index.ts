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

    // Prepare trends summary with full details
    const trendsSummary = trends.slice(0, 5).map((t: any, i: number) => 
      `${i + 1}. **${t.title}**
   Description: ${t.description}
   Mentions: ${t.mentions || 'N/A'}
   Sentiment: ${typeof t.sentiment === 'number' ? (t.sentiment > 0 ? 'Positive' : t.sentiment < 0 ? 'Negative' : 'Neutral') : 'N/A'}
   Category: ${t.category || 'General'}`
    ).join('\n\n');

    // Build style training context from past newsletters
    const styleContext = pastNewsletters.length > 0 
      ? `\n\nPast newsletter examples for style reference:\n${pastNewsletters.map((n: any, i: number) => 
          `Example ${i + 1}:\n${n.content.substring(0, 500)}...`
        ).join('\n\n')}`
      : '';

    // Add timestamp and unique context for variation
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const uniqueContext = `Generation Date: ${currentDate}\nNewsletter ID: ${Date.now()}\nNumber of trends: ${trends.length}`;

    const systemPrompt = `You are a professional newsletter writer specializing in enterprise-grade, visually appealing content. Create well-structured, scannable newsletters with clear sections, compelling headlines, and engaging formatting. 

CRITICAL: You MUST create UNIQUE, ORIGINAL content for each newsletter request. Never reuse the same examples, phrases, or structure from previous newsletters. Each newsletter should feel fresh and distinctive based on the specific trends provided.

${styleContext ? 'Use the provided examples to match the writing style, but generate completely NEW content.' : ''}`;

    const userPrompt = `${uniqueContext}

Write a UNIQUE newsletter draft based on these specific trending topics:

${trendsSummary}

**USER PREFERENCES:**
- Writing Style: ${preferences.writingStyle}
- Tone: ${preferences.tone}
- Length: ${preferences.length}
- Focus Topics: ${preferences.topics.join(', ')}
${styleContext}

**IMPORTANT INSTRUCTIONS:**
Create a COMPLETELY NEW and UNIQUE enterprise-grade newsletter. DO NOT reuse content, examples, or phrasing from previous newsletters. Focus specifically on the trends listed above and create fresh, original analysis.

**Newsletter Structure:**
1. **Subject Line**: ${subjectLine ? `Use this subject: "${subjectLine}"` : 'Create a compelling, UNIQUE subject line under 60 characters that reflects the specific trends'}
2. **Opening Hook**: 1-2 sentence attention grabber (make it specific to today's trends)
3. **Introduction**: Brief context paragraph explaining why these specific trends matter NOW
4. **Main Content**: Cover ${trends.length === 1 ? 'the trend in-depth' : `ALL ${trends.length} trends`}, each with:
   - Bold headline with <h2> (specific to the trend)
   - 2-3 paragraph analysis with UNIQUE insights
   - Key takeaways as bullet points
   - Relevant context or implications
5. **Commentary/Analysis**: Your ORIGINAL expert perspective on how these trends connect or impact the industry
6. **Closing**: Strong CTA and professional sign-off

CRITICAL FORMATTING RULES:
- Output ONLY clean HTML fragments (NO <!DOCTYPE>, <html>, <head>, <body>, or <style> tags)
- Do NOT include ANY escape sequences like \n, \t, \r, or \\
- Write HTML as continuous text without literal newlines or tabs
- Use proper HTML tags for structure, not escape characters

Use these HTML elements:
- <h2> for section headlines
- <p> for paragraphs  
- <strong> or <b> for emphasis
- <ul> and <li> for bullet lists
- <a href="https://example.com"> for links
- <hr> for section dividers

Format your response as clean JSON with NO escape sequences:
{
  "subject": "Your subject line here",
  "content": "<p>HTML content with proper tags but NO \\n or \\t characters</p><h2>Next Section</h2><p>More content...</p>"
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
    console.log('Generated text (first 200 chars):', generatedText.substring(0, 200));

    // Aggressive content cleaning function
    const cleanContent = (text: string): string => {
      let cleaned = text;
      
      // First pass: Remove all backslash escape sequences
      cleaned = cleaned
        .replace(/\\n/g, '') // Remove literal \n
        .replace(/\\t/g, '') // Remove literal \t  
        .replace(/\\r/g, '') // Remove literal \r
        .replace(/\\\\/g, '\\') // Convert \\ to \
        .replace(/\\"/g, '"') // Convert \" to "
        .replace(/\\'/g, "'"); // Convert \' to '
      
      // Second pass: Remove any remaining backslash-escaped characters
      cleaned = cleaned.replace(/\\(.)/g, '$1');
      
      // Third pass: Clean up whitespace but preserve HTML structure
      cleaned = cleaned
        .replace(/>\s+</g, '><') // Remove whitespace between tags
        .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
        .trim();
      
      return cleaned;
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
    } catch (parseError) {
      console.error('JSON parse failed, using fallback:', parseError);
      // Fallback: extract subject and content from text
      const subjectMatch = generatedText.match(/"subject":\s*"([^"]+)"/);
      const contentMatch = generatedText.match(/"content":\s*"([\s\S]+?)"\s*\}/);
      
      result = {
        subject: cleanContent(subjectMatch?.[1] || 'Weekly Newsletter Update'),
        content: cleanContent(contentMatch?.[1] || generatedText)
      };
    }

    console.log('Cleaned subject:', result.subject);
    console.log('Cleaned content (first 200 chars):', result.content.substring(0, 200));
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
