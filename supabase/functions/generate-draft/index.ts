import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trends, preferences } = await req.json();

    if (!trends || !preferences) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: trends and preferences' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare trends summary
    const trendsSummary = trends.slice(0, 5).map((t: any, i: number) => 
      `${i + 1}. ${t.title}: ${t.description} (${t.mentions} mentions, sentiment: ${t.sentiment})`
    ).join('\n');

    const systemPrompt = `You are a professional newsletter writer. Create engaging, informative newsletter content that captures reader attention.`;

    const userPrompt = `Write a newsletter draft based on these trending topics:

${trendsSummary}

Writing Style: ${preferences.writingStyle}
Tone: ${preferences.tone}
Length: ${preferences.length}
Focus Topics: ${preferences.topics.join(', ')}

Generate a newsletter with:
1. A compelling subject line (max 60 characters)
2. An engaging introduction
3. Coverage of the top 3-4 trends with insights
4. A conclusion with a call to action

Format your response as JSON:
{
  "subject": "Your subject line here",
  "content": "Full newsletter content here with proper formatting"
}`;

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate draft with OpenAI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log('Generated text:', generatedText);

    // Try to parse as JSON, fallback to text parsing
    let result;
    try {
      result = JSON.parse(generatedText);
    } catch {
      // Fallback: extract subject and content from text
      const subjectMatch = generatedText.match(/"subject":\s*"([^"]+)"/);
      const contentMatch = generatedText.match(/"content":\s*"([^"]+)"/s);
      
      result = {
        subject: subjectMatch?.[1] || 'Weekly Newsletter Update',
        content: contentMatch?.[1] || generatedText
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
