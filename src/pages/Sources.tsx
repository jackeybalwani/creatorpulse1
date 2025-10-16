import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Twitter, Youtube, Rss, Plus, Trash2, CheckCircle2, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { SourceType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

const Sources = () => {
  const { sources, addSource, updateSource, deleteSource } = useApp();
  const { toast } = useToast();
  const [sourceType, setSourceType] = useState<SourceType>('twitter');
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

  const handleAddSource = () => {
    if (!sourceUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL or handle",
        variant: "destructive",
      });
      return;
    }

    const name = sourceUrl.startsWith('@') ? sourceUrl : sourceUrl.split('/').pop() || sourceUrl;
    addSource({
      type: sourceType,
      name,
      url: sourceUrl,
      isActive: true,
      trackedCount: 0,
    });

    toast({
      title: "Source Added!",
      description: `Successfully added ${name} to your sources`,
    });

    setSourceUrl('');
  };

  const twitterSources = sources.filter(s => s.type === 'twitter');
  const youtubeSources = sources.filter(s => s.type === 'youtube');
  const rssSources = sources.filter(s => s.type === 'rss');

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
          disabled={syncing || sources.length === 0}
          className="gap-2"
        >
          {syncing ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Syncing...</>
          ) : (
            <><RefreshCw className="h-4 w-4" /> Sync Now</>
          )}
        </Button>
      </div>

      {/* Add New Source */}
      <Card>
        <CardHeader>
          <CardTitle>Connect New Source</CardTitle>
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
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="source-url">URL or Handle</Label>
              <div className="flex gap-2">
                <Input 
                  id="source-url" 
                  placeholder="@username or https://..." 
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
              {twitterSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                      <Twitter className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground">{source.trackedCount} posts tracked</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
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
              ))}
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
              {youtubeSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                      <Youtube className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground">{source.trackedCount} videos tracked</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
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
              ))}
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
              {rssSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                      <Rss className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground">{source.url} • {source.trackedCount} articles tracked</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
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
              ))}
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
