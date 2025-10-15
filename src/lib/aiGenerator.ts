import { pipeline, env } from '@huggingface/transformers';
import { Trend, UserPreferences } from './types';

// Configure to use local models
env.allowLocalModels = false;
env.allowRemoteModels = true;

let generator: any = null;

export async function initializeAI() {
  if (!generator) {
    console.log('Initializing AI model...');
    generator = await pipeline(
      'text-generation',
      'onnx-community/Qwen2.5-0.5B-Instruct',
      { device: 'webgpu' }
    );
    console.log('AI model loaded successfully');
  }
  return generator;
}

export async function generateNewsletterDraft(
  trends: Trend[],
  preferences: UserPreferences
): Promise<{ subject: string; content: string }> {
  const gen = await initializeAI();
  
  // Prepare context from trends
  const trendsSummary = trends.slice(0, 5).map((t, i) => 
    `${i + 1}. ${t.title}: ${t.description} (${t.mentions} mentions)`
  ).join('\n');

  const prompt = `Write a newsletter draft based on these trending topics:

${trendsSummary}

Style: ${preferences.writingStyle}
Tone: ${preferences.tone}
Length: ${preferences.length}
Topics: ${preferences.topics.join(', ')}

Generate:
1. A compelling subject line (max 60 chars)
2. A newsletter body with introduction, main points, and conclusion

Format your response as:
SUBJECT: [subject line]
BODY: [newsletter content]`;

  const result = await gen(prompt, {
    max_new_tokens: 512,
    temperature: 0.7,
    do_sample: true,
  });

  const text = result[0].generated_text.split(prompt)[1] || result[0].generated_text;
  
  // Parse the response
  const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|BODY:)/i);
  const bodyMatch = text.match(/BODY:\s*(.+)/is);
  
  return {
    subject: subjectMatch?.[1]?.trim() || 'Weekly Newsletter Update',
    content: bodyMatch?.[1]?.trim() || text.trim()
  };
}
