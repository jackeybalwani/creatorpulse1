import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Twitter, Youtube, Rss, Plus, Trash2, CheckCircle2 } from "lucide-react";

const Sources = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Sources</h1>
          <p className="text-muted-foreground mt-1">Manage your connected sources for trend detection</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Source
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>Twitter/X Handle</option>
                <option>YouTube Channel</option>
                <option>RSS Feed</option>
                <option>Newsletter RSS</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="source-url">URL or Handle</Label>
              <div className="flex gap-2">
                <Input id="source-url" placeholder="@username or https://..." className="flex-1" />
                <Button>Add</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-blue-500" />
                Twitter/X Accounts
              </CardTitle>
              <CardDescription>Following 6 accounts</CardDescription>
            </div>
            <Badge variant="outline">Free API</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { handle: "@sama", name: "Sam Altman", active: true, posts: "142 posts" },
              { handle: "@AndrewYNg", name: "Andrew Ng", active: true, posts: "89 posts" },
              { handle: "@karpathy", name: "Andrej Karpathy", active: true, posts: "56 posts" },
              { handle: "@ylecun", name: "Yann LeCun", active: true, posts: "234 posts" },
              { handle: "@emollick", name: "Ethan Mollick", active: true, posts: "178 posts" },
              { handle: "@GaryMarcus", name: "Gary Marcus", active: false, posts: "67 posts" },
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Twitter className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{source.handle}</p>
                    <p className="text-sm text-muted-foreground">{source.name} • {source.posts} tracked</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={source.active} />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* YouTube Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                YouTube Channels
              </CardTitle>
              <CardDescription>Following 4 channels</CardDescription>
            </div>
            <Badge variant="outline">Public Data</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Two Minute Papers", active: true, videos: "24 videos" },
              { name: "Yannic Kilcher", active: true, videos: "18 videos" },
              { name: "AI Explained", active: true, videos: "31 videos" },
              { name: "The AI Advantage", active: true, videos: "42 videos" },
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <Youtube className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-muted-foreground">{source.videos} tracked</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={source.active} />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RSS Feeds */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rss className="h-5 w-5 text-orange-500" />
                RSS Feeds
              </CardTitle>
              <CardDescription>Following 2 feeds</CardDescription>
            </div>
            <Badge variant="outline">Free</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "TechCrunch AI", url: "techcrunch.com", active: true, articles: "67 articles" },
              { name: "The Verge AI", url: "theverge.com", active: true, articles: "45 articles" },
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                    <Rss className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-muted-foreground">{source.url} • {source.articles} tracked</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={source.active} />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Health */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div>
            <p className="font-medium">All sources healthy</p>
            <p className="text-sm text-muted-foreground">Last sync: 2 hours ago • Next sync: in 22 hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sources;
