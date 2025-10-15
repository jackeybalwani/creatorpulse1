import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Source, Trend, Draft, UserPreferences } from '@/lib/types';
import { sourcesStorage, trendsStorage, draftsStorage, preferencesStorage } from '@/lib/storage';
import { generateMockTrends, generateMockDraft } from '@/lib/mockData';
import { generateNewsletterDraft } from '@/lib/aiGenerator';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  sources: Source[];
  trends: Trend[];
  drafts: Draft[];
  preferences: UserPreferences;
  addSource: (source: Omit<Source, 'id' | 'addedAt'>) => void;
  updateSource: (id: string, updates: Partial<Source>) => void;
  deleteSource: (id: string) => void;
  generateDraft: () => Promise<void>;
  updateDraft: (id: string, updates: Partial<Draft>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  refreshTrends: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(preferencesStorage.get());

  // Load data on mount
  useEffect(() => {
    setSources(sourcesStorage.getAll());
    setTrends(trendsStorage.getAll());
    setDrafts(draftsStorage.getAll());
    
    // Initialize with mock data if empty
    if (trendsStorage.getAll().length === 0) {
      const mockTrends = generateMockTrends();
      trendsStorage.save(mockTrends);
      setTrends(mockTrends);
    }
  }, []);

  const addSource = (source: Omit<Source, 'id' | 'addedAt'>) => {
    const newSource = sourcesStorage.add(source);
    setSources(sourcesStorage.getAll());
  };

  const updateSource = (id: string, updates: Partial<Source>) => {
    sourcesStorage.update(id, updates);
    setSources(sourcesStorage.getAll());
  };

  const deleteSource = (id: string) => {
    sourcesStorage.delete(id);
    setSources(sourcesStorage.getAll());
  };

  const generateDraft = async () => {
    try {
      toast({
        title: "Generating draft...",
        description: "AI is analyzing trends and creating your newsletter",
      });

      const currentTrends = trendsStorage.getAll();
      const { subject, content } = await generateNewsletterDraft(currentTrends, preferences);
      
      const newDraft: Omit<Draft, 'id'> = {
        subject,
        content,
        status: 'pending',
        generatedAt: new Date().toISOString(),
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        trendIds: currentTrends.slice(0, 5).map(t => t.id),
      };
      
      draftsStorage.add(newDraft);
      setDrafts(draftsStorage.getAll());
      
      toast({
        title: "Draft generated!",
        description: "Your AI-powered newsletter is ready for review",
      });
    } catch (error) {
      console.error('Error generating draft:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateDraft = (id: string, updates: Partial<Draft>) => {
    draftsStorage.update(id, updates);
    setDrafts(draftsStorage.getAll());
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    preferencesStorage.save(newPreferences);
    setPreferences(newPreferences);
  };

  const refreshTrends = () => {
    const newTrends = generateMockTrends();
    trendsStorage.save(newTrends);
    setTrends(newTrends);
  };

  return (
    <AppContext.Provider
      value={{
        sources,
        trends,
        drafts,
        preferences,
        addSource,
        updateSource,
        deleteSource,
        generateDraft,
        updateDraft,
        updatePreferences,
        refreshTrends,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
