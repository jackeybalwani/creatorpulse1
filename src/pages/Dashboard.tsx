import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Clock, TrendingUp, CheckCircle2, Sparkles, Calendar } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-background p-8 border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(262_83%_58%/0.1),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Good morning! ☀️</h1>
              <p className="text-lg text-muted-foreground">Your next newsletter draft is ready for review</p>
            </div>
            <Badge className="bg-accent text-accent-foreground">Next delivery in 18h</Badge>
          </div>
          <div className="mt-6 flex gap-3">
            <Button size="lg" className="gap-2">
              <FileText className="h-4 w-4" />
              Review Draft
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate New
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 hours</div>
            <p className="text-xs text-muted-foreground">per newsletter draft</p>
            <Progress value={83} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">drafts approved with minimal edits</p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Twitter, YouTube, RSS feeds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletters Sent</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Drafts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Drafts</CardTitle>
          <CardDescription>Your AI-generated newsletter drafts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "Weekly AI Roundup - Jan 15", status: "Ready", time: "Generated 2h ago", acceptance: "pending" },
              { title: "Tech Trends Newsletter - Jan 8", status: "Sent", time: "Sent 7 days ago", acceptance: "approved" },
              { title: "Creator Economy Insights - Jan 1", status: "Sent", time: "Sent 14 days ago", acceptance: "approved" },
            ].map((draft, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{draft.title}</p>
                    <p className="text-sm text-muted-foreground">{draft.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={draft.acceptance === "approved" ? "default" : "secondary"}>
                    {draft.status}
                  </Badge>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Trending Topics
          </CardTitle>
          <CardDescription>Emerging trends detected from your sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { topic: "AI Agents", heat: 95 },
              { topic: "GPT-5 Rumors", heat: 87 },
              { topic: "Creator Tools", heat: 76 },
              { topic: "Web3 Revival", heat: 68 },
              { topic: "Video AI", heat: 62 },
              { topic: "Open Source LLMs", heat: 58 },
            ].map((trend, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1.5 text-sm"
                style={{
                  background: `linear-gradient(135deg, hsl(38 92% 50% / ${trend.heat / 100}), hsl(45 98% 55% / ${trend.heat / 100}))`,
                  borderColor: `hsl(38 92% 50% / ${trend.heat / 100})`,
                }}
              >
                🔥 {trend.topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
