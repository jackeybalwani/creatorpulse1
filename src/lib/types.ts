export type SourceType = 'twitter' | 'youtube' | 'rss' | 'google-alerts' | 'google-trends' | 'reddit' | 'hacker-news';
export type DraftStatus = 'draft' | 'reviewed' | 'sent';
export type FeedbackType = 'positive' | 'negative' | 'neutral';
export type SyncStatus = 'pending' | 'syncing' | 'success' | 'error';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  url: string;
  isActive: boolean;
  is_active?: boolean;
  trackedCount: number;
  tracked_count?: number;
  addedAt: string;
  added_at?: string;
  lastSyncAt?: string;
  last_sync_at?: string;
  syncStatus?: SyncStatus;
  sync_status?: SyncStatus;
  syncError?: string;
  sync_error?: string;
  user_id?: string;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
  sourceIds: string[];
  mentions: number;
  sentiment: number;
  detectedAt: string;
  detected_at?: string;
  category: string;
  user_id?: string;
}

export interface Draft {
  id: string;
  subject: string;
  content: string;
  status: DraftStatus;
  generatedAt: string;
  generated_at?: string;
  scheduledFor: string;
  scheduled_for?: string;
  sentAt?: string;
  sent_at?: string;
  trendIds: string[];
  feedback?: {
    rating: number;
    comments: string;
    improvements: string[];
  };
  user_id?: string;
}

export interface UserPreferences {
  writingStyle: string;
  writing_style?: string;
  tone: string;
  length: 'short' | 'medium' | 'long';
  topics: string[];
  deliveryTime: string;
  delivery_time?: string;
  emailAddress: string;
  email_address?: string;
}

export interface PastNewsletter {
  id?: string;
  title: string;
  content: string;
  sentDate?: string;
  sent_date?: string;
  uploadedAt?: string;
  uploaded_at?: string;
  user_id?: string;
}

export interface DraftFeedback {
  id?: string;
  draft_id: string;
  original_subject?: string;
  edited_subject?: string;
  original_content?: string;
  edited_content?: string;
  rating?: number;
  comments?: string;
  user_id?: string;
}
