import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Source, Trend, Draft, UserPreferences, DraftStatus } from '@/lib/types';
import { sourcesStorage } from '@/lib/storage';
import { generateMockTrends } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';
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
  const [preferences, setPreferences] = useState<UserPreferences>({
    writingStyle: 'Professional yet conversational',
    tone: 'informative',
    length: 'medium',
    topics: [],
    deliveryTime: '08:00',
    emailAddress: '',
  });
  const [user, setUser] = useState<any>(null);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      // Load sources from localStorage (not in DB yet)
      setSources(sourcesStorage.getAll());

      // Load trends from database
      const { data: trendsData } = await supabase
        .from('trends')
        .select('*')
        .order('detected_at', { ascending: false });
      
      if (trendsData && trendsData.length > 0) {
        setTrends(trendsData.map(t => ({
          ...t,
          detectedAt: t.detected_at,
          sourceIds: [],
        })));
      } else {
        // Initialize with mock data if empty
        const mockTrends = generateMockTrends();
        for (const trend of mockTrends) {
          await supabase.from('trends').insert({
            user_id: user.id,
            title: trend.title,
            description: trend.description,
            mentions: trend.mentions,
            sentiment: trend.sentiment,
            detected_at: trend.detectedAt,
            category: trend.category,
          });
        }
        setTrends(mockTrends);
      }

      // Load drafts from database
      const { data: draftsData } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (draftsData) {
        setDrafts(draftsData.map(d => ({
          id: d.id,
          subject: d.subject,
          content: d.content,
          status: d.status === 'sent' ? 'sent' : d.status === 'reviewed' ? 'reviewed' : 'pending' as DraftStatus,
          generatedAt: d.created_at,
          scheduledFor: d.created_at,
          trendIds: [],
        })));
      }

      // Load preferences from database
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('*')
        .single();
      
      if (prefsData) {
        setPreferences({
          writingStyle: prefsData.writing_style,
          tone: prefsData.tone,
          length: (prefsData.length as 'short' | 'medium' | 'long') || 'medium',
          deliveryTime: prefsData.delivery_time,
          emailAddress: prefsData.email_address,
          topics: prefsData.topics,
        });
      } else {
        // Create default preferences
        await supabase.from('user_preferences').insert({
          user_id: user.id,
          writing_style: preferences.writingStyle,
          tone: preferences.tone,
          length: preferences.length,
          delivery_time: preferences.deliveryTime,
          email_address: preferences.emailAddress,
          topics: preferences.topics,
        });
      }
    };

    loadData();
  }, [user]);

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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate drafts",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Generating draft...",
        description: "AI is analyzing trends and creating your newsletter",
      });

      const { data, error } = await supabase.functions.invoke('generate-draft', {
        body: { 
          trends,
          preferences 
        }
      });

      if (error) {
        throw error;
      }

      const { subject, content } = data;
      
      const { data: newDraft, error: insertError } = await supabase
        .from('drafts')
        .insert({
          user_id: user.id,
          subject,
          content,
          status: 'draft',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setDrafts([{
        id: newDraft.id,
        subject: newDraft.subject,
        content: newDraft.content,
        status: 'pending' as DraftStatus,
        generatedAt: newDraft.created_at,
        scheduledFor: newDraft.created_at,
        trendIds: [],
      }, ...drafts]);
      
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

  const updateDraft = async (id: string, updates: Partial<Draft>) => {
    if (!user) return;

    await supabase
      .from('drafts')
      .update({
        subject: updates.subject,
        content: updates.content,
        status: updates.status,
      })
      .eq('id', id);

    setDrafts(drafts.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    const newPreferences = { ...preferences, ...updates };
    
    await supabase
      .from('user_preferences')
      .update({
        writing_style: newPreferences.writingStyle,
        tone: newPreferences.tone,
        length: newPreferences.length,
        delivery_time: newPreferences.deliveryTime,
        email_address: newPreferences.emailAddress,
        topics: newPreferences.topics,
      })
      .eq('user_id', user.id);

    setPreferences(newPreferences);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  const refreshTrends = async () => {
    if (!user) return;

    const newTrends = generateMockTrends();
    
    for (const trend of newTrends) {
      await supabase.from('trends').insert({
        user_id: user.id,
        title: trend.title,
        description: trend.description,
        mentions: trend.mentions,
        sentiment: trend.sentiment,
        detected_at: trend.detectedAt,
        category: trend.category,
      });
    }
    
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
