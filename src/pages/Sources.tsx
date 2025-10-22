import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Twitter, Youtube, Rss, Plus, Trash2, CheckCircle2, RefreshCw, Loader2, AlertCircle, Bell, TrendingUp, MessageSquare, Hash } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { SourceType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

const Sources = () => {
  const { sources, addSource, updateSource, deleteSource } = useApp();
  const { toast } = useToast();
  const [sourceType, setSourceType] = useState<SourceType>('google-trends');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [syncing, setSyncing] = useState(false);

  const handleSyncSources = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('sync-sources');
      
      if (error) throw error;

      toast({
        title: "Sources synced successfully!",
        description: "All active sources have been checked for new content",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleQuickAddSource = (type: SourceType, name: string, url: string) => {
    addSource({
      type,
      name,
      url,
      isActive: true,
      trackedCount: 0,
    });

    toast({
      title: "Source Added!",
      description: `Successfully added ${name}`,
    });
  };

  const handleAddSource = () => {
    if (!sourceUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL or handle",
        variant: "destructive",
      });
      return;
    }

    const name = sourceName || (sourceUrl.startsWith('@') ? sourceUrl : sourceUrl.split('/').pop() || sourceUrl);
    addSource({
      type: sourceType,
      name,
      url: sourceUrl,
      isActive: true,
      trackedCount: 0,
    });

    toast({
      title: "Source Added!",
      description: `Successfully added ${name}`,
    });

    setSourceUrl('');
    setSourceName('');
  };

  const googleTrendsSources = sources.filter(s => s.type === 'google-trends');
  const redditSources = sources.filter(s => s.type === 'reddit');
  const hackerNewsSources = sources.filter(s => s.type === 'hacker-news');
  const googleAlertsSources = sources.filter(s => s.type === 'google-alerts');
  const twitterSources = sources.filter(s => s.type === 'twitter');
  const youtubeSources = sources.filter(s => s.type === 'youtube');
  const rssSources = sources.filter(s => s.type === 'rss');
  
  const renderSourceCard = (source: any) => {
    const iconMap: Record<SourceType, any> = {
      'google-trends': { icon: TrendingUp, color: 'purple' },
      'reddit': { icon: MessageSquare, color: 'orange' },
      'hacker-news': { icon: Hash, color: 'orange' },
      'google-alerts': { icon: Bell, color: 'green' },
      'twitter': { icon: Twitter, color: 'blue' },
      'youtube': { icon: Youtube, color: 'red' },
      'rss': { icon: Rss, color: 'orange' },
    };
    const { icon: Icon, color } = iconMap[source.type] || { icon: Rss, color: 'gray' };
    
    return (
      <div key={source.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${color}-500/10`}>
            <Icon className={`h-5 w-5 text-${color}-500`} />
          </div>
          <div>
            <p className="font-medium">{source.name}</p>
            <p className="text-sm text-muted-foreground">{source.trackedCount} items tracked</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {source.syncStatus && (
            <Badge variant={source.syncStatus === 'success' ? 'outline' : source.syncStatus === 'error' ? 'destructive' : 'secondary'}>
              {source.syncStatus}
            </Badge>
          )}
          <div className="flex items-center gap-2">
            <Switch 
              checked={source.isActive}
              onCheckedChange={(checked) => updateSource(source.id, { isActive: checked })}
            />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              deleteSource(source.id);
              toast({ title: "Source removed" });
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Sources</h1>
          <p className="text-muted-foreground mt-1">Manage your connected sources for trend detection</p>
        </div>
        <Button
          onClick={handleSyncSources}
          disabled={syncing || sources.filter(s => s.isActive).length === 0}
          className="gap-2"
        >
          {syncing ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Syncing...</>
          ) : (
            <><RefreshCw className="h-4 w-4" /> Sync Now</>
          )}
        </Button>
      </div>

      {/* Quick Add Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add Sources</CardTitle>
          <CardDescription>Add popular sources with one click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => handleQuickAddSource(
                'google-trends',
                'Google Trends US',
                'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US'
              )}
            >
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Google Trends</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => handleQuickAddSource(
                'hacker-news',
                'Hacker News Front Page',
                'https://news.ycombinator.com/rss'
              )}
            >
              <Hash className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Hacker News</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => {
                const name = prompt('Enter a name for this Reddit source (e.g., "r/technology"):');
                const url = prompt('Enter subreddit URL (e.g., https://www.reddit.com/r/technology):');
                if (name && url) {
                  handleQuickAddSource('reddit', name, url);
                }
              }}
            >
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Reddit</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-4"
              onClick={() => {
                const name = prompt('Enter a name for this Google Alert:');
                const url = prompt('Enter Google Alerts RSS URL:');
                if (name && url) {
                  handleQuickAddSource('google-alerts', name, url);
                }
              }}
            >
              <Bell className="h-5 w-5 text-green-500" />
              <span className="font-medium">Google Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Source */}
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Source</CardTitle>
          <CardDescription>Add Twitter/X handles, YouTube channels, or RSS feeds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="source-type">Source Type</Label>
              <select
                id="source-type"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="twitter">Twitter/X Handle</option>
                <option value="youtube">YouTube Channel</option>
                <option value="rss">RSS Feed</option>
                <option value="reddit">Reddit</option>
                <option value="google-alerts">Google Alerts</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="source-url">URL or Handle</Label>
              <div className="flex gap-2">
                <Input 
                  id="source-url" 
                  placeholder={
                    sourceType === 'reddit' ? "https://www.reddit.com/r/technology" :
                    sourceType === 'google-alerts' ? "Google Alerts RSS Feed URL" :
                    sourceType === 'rss' ? "https://example.com/feed.xml" :
                    sourceType === 'youtube' ? "Channel ID" :
                    "@twitter_handle"
                  }
                  className="flex-1"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                />
                <Button onClick={handleAddSource}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Trends Sources */}
      {googleTrendsSources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Google Trends
                </CardTitle>
                <CardDescription>Monitoring {googleTrendsSources.length} trend source{googleTrendsSources.length > 1 ? 's' : ''}</CardDescription>
              </div>
              <Badge variant="outline">Free</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {googleTrendsSources.map((source) => renderSourceCard(source))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reddit Sources */}
      {redditSources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  Reddit
                </CardTitle>
                <CardDescription>Following {redditSources.length} subreddit{redditSources.length > 1 ? 's' : ''}</CardDescription>
              </div>
              <Badge variant="outline">Free</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redditSources.map((source) => renderSourceCard(source))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hacker News Sources */}
      {hackerNewsSources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-orange-500" />
                  Hacker News
                </CardTitle>
                <CardDescription>Following {hackerNewsSources.length} feed{hackerNewsSources.length > 1 ? 's' : ''}</CardDescription>
              </div>
              <Badge variant="outline">Free</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hackerNewsSources.map((source) => renderSourceCard(source))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google Alerts */}
      {googleAlertsSources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-500" />
                  Google Alerts
                </CardTitle>
                <CardDescription>Monitoring {googleAlertsSources.length} alert{googleAlertsSources.length > 1 ? 's' : ''}</CardDescription>
              </div>
              <Badge variant="outline">Free</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {googleAlertsSources.map((source) => renderSourceCard(source))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Twitter Sources */}
      {twitterSources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-blue-500" />
                  Twitter/X Accounts
                </CardTitle>
                <CardDescription>Following {twitterSources.length} accounts</CardDescription>
              </div>
              <Badge variant="outline">Free API</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {twitterSources.map((source) => renderSourceCard(source))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* YouTube Sources */}
      {youtubeSources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  YouTube Channels
                </CardTitle>
                <CardDescription>Following {youtubeSources.length} channels</CardDescription>
              </div>
              <Badge variant="outline">Public Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {youtubeSources.map((source) => renderSourceCard(source))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RSS Feeds */}
      {rssSources.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Rss className="h-5 w-5 text-orange-500" />
                  RSS Feeds
                </CardTitle>
                <CardDescription>Following {rssSources.length} feeds</CardDescription>
              </div>
              <Badge variant="outline">Free</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rssSources.map((source) => renderSourceCard(source))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Health */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div>
            <p className="font-medium">All sources healthy</p>
            <p className="text-sm text-muted-foreground">
              {sources.length} total sources • {sources.filter(s => s.isActive).length} active
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sources;
