import { Source, Trend, Draft } from './types';

export const generateMockTrends = (): Trend[] => [
  {
    id: crypto.randomUUID(),
    title: 'AI-Generated Content Regulation',
    description: 'New EU regulations on AI-generated content labeling gaining traction across multiple channels',
    sourceIds: [],
    mentions: 24,
    sentiment: 0.3,
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'Regulation',
  },
  {
    id: crypto.randomUUID(),
    title: 'Creator Economy Growth',
    description: 'Discussion about creator economy reaching $250B valuation trending across platforms',
    sourceIds: [],
    mentions: 18,
    sentiment: 0.8,
    detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: 'Economy',
  },
  {
    id: crypto.randomUUID(),
    title: 'Short-Form Video Fatigue',
    description: 'Creators reporting audience fatigue with short-form content, shift to longer formats',
    sourceIds: [],
    mentions: 15,
    sentiment: 0.2,
    detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: 'Content',
  },
];

export const generateMockDraft = (trends: Trend[]): Draft => {
  const trendTitles = trends.slice(0, 2).map(t => t.title).join(' and ');
  
  return {
    id: crypto.randomUUID(),
    subject: `This Week in Creator Economy: ${trendTitles}`,
    content: `Hey there! 👋

This week has been absolutely buzzing in the creator space. Let me break down what you need to know:

## 🔥 ${trends[0]?.title || 'Top Trend'}

${trends[0]?.description || 'Interesting developments in the creator space this week.'}

This is a big deal because it shows how the landscape is evolving. Based on ${trends[0]?.mentions || 0} mentions across your sources, this is clearly resonating with your audience.

## 📊 ${trends[1]?.title || 'Second Trend'}

${trends[1]?.description || 'More developments worth your attention.'}

What's fascinating here is the sentiment around this - people are ${trends[1]?.sentiment && trends[1].sentiment > 0.5 ? 'optimistic' : 'cautious'} about these changes.

## 💡 What This Means For You

These trends suggest that now is the perfect time to:
- Experiment with your content format
- Engage with regulatory discussions
- Position yourself as a thought leader

Stay ahead of the curve, and keep creating!

Best,
Your CreatorPulse AI`,
    status: 'draft',
    generatedAt: new Date().toISOString(),
    scheduledFor: new Date(new Date().setHours(8, 0, 0, 0) + 24 * 60 * 60 * 1000).toISOString(),
    trendIds: trends.slice(0, 2).map(t => t.id),
  };
};
