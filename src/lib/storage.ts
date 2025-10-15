import { Source, Trend, Draft, UserPreferences } from './types';

const STORAGE_KEYS = {
  SOURCES: 'creatorpulse_sources',
  TRENDS: 'creatorpulse_trends',
  DRAFTS: 'creatorpulse_drafts',
  PREFERENCES: 'creatorpulse_preferences',
} as const;

// Generic storage functions
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

// Sources
export const sourcesStorage = {
  getAll: (): Source[] => storage.get<Source[]>(STORAGE_KEYS.SOURCES) || [],
  
  save: (sources: Source[]): void => storage.set(STORAGE_KEYS.SOURCES, sources),
  
  add: (source: Omit<Source, 'id' | 'addedAt'>): Source => {
    const sources = sourcesStorage.getAll();
    const newSource: Source = {
      ...source,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    };
    sources.push(newSource);
    sourcesStorage.save(sources);
    return newSource;
  },
  
  update: (id: string, updates: Partial<Source>): void => {
    const sources = sourcesStorage.getAll();
    const index = sources.findIndex(s => s.id === id);
    if (index !== -1) {
      sources[index] = { ...sources[index], ...updates };
      sourcesStorage.save(sources);
    }
  },
  
  delete: (id: string): void => {
    const sources = sourcesStorage.getAll();
    sourcesStorage.save(sources.filter(s => s.id !== id));
  },
};

// Trends
export const trendsStorage = {
  getAll: (): Trend[] => storage.get<Trend[]>(STORAGE_KEYS.TRENDS) || [],
  
  save: (trends: Trend[]): void => storage.set(STORAGE_KEYS.TRENDS, trends),
  
  add: (trend: Omit<Trend, 'id' | 'detectedAt'>): Trend => {
    const trends = trendsStorage.getAll();
    const newTrend: Trend = {
      ...trend,
      id: crypto.randomUUID(),
      detectedAt: new Date().toISOString(),
    };
    trends.push(newTrend);
    trendsStorage.save(trends);
    return newTrend;
  },
};

// Drafts
export const draftsStorage = {
  getAll: (): Draft[] => storage.get<Draft[]>(STORAGE_KEYS.DRAFTS) || [],
  
  save: (drafts: Draft[]): void => storage.set(STORAGE_KEYS.DRAFTS, drafts),
  
  add: (draft: Omit<Draft, 'id' | 'generatedAt'>): Draft => {
    const drafts = draftsStorage.getAll();
    const newDraft: Draft = {
      ...draft,
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
    };
    drafts.push(newDraft);
    draftsStorage.save(drafts);
    return newDraft;
  },
  
  update: (id: string, updates: Partial<Draft>): void => {
    const drafts = draftsStorage.getAll();
    const index = drafts.findIndex(d => d.id === id);
    if (index !== -1) {
      drafts[index] = { ...drafts[index], ...updates };
      draftsStorage.save(drafts);
    }
  },
  
  getLatest: (): Draft | null => {
    const drafts = draftsStorage.getAll();
    return drafts.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    )[0] || null;
  },
};

// User Preferences
export const preferencesStorage = {
  get: (): UserPreferences => storage.get<UserPreferences>(STORAGE_KEYS.PREFERENCES) || {
    writingStyle: 'Professional yet conversational',
    tone: 'informative',
    length: 'medium',
    topics: [],
    deliveryTime: '08:00',
    emailAddress: '',
  },
  
  save: (preferences: UserPreferences): void => 
    storage.set(STORAGE_KEYS.PREFERENCES, preferences),
};
