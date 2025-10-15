export type SourceType = 'twitter' | 'youtube' | 'rss';
export type DraftStatus = 'pending' | 'reviewed' | 'sent';
export type FeedbackType = 'positive' | 'negative' | 'neutral';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  url: string;
  isActive: boolean;
  trackedCount: number;
  addedAt: string;
  lastSyncAt?: string;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
  sourceIds: string[];
  mentions: number;
  sentiment: number;
  detectedAt: string;
  category: string;
}

export interface Draft {
  id: string;
  subject: string;
  content: string;
  status: DraftStatus;
  generatedAt: string;
  scheduledFor: string;
  trendIds: string[];
  feedback?: {
    rating: number;
    comments: string;
    improvements: string[];
  };
}

export interface UserPreferences {
  writingStyle: string;
  tone: string;
  length: 'short' | 'medium' | 'long';
  topics: string[];
  deliveryTime: string;
  emailAddress: string;
}
