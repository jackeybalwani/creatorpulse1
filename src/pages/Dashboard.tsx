import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Clock, TrendingUp, CheckCircle2, Sparkles, Calendar, Star, MessageSquare } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { sources, trends, drafts, generateDraft } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [avgRating, setAvgRating] = useState<number>(0);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  
  const latestDraft = drafts[drafts.length - 1];
  const activeSources = sources.filter(s => s.isActive).length;
  const approvedDrafts = drafts.filter(d => d.status === 'reviewed').length;
  const acceptanceRate = drafts.length > 0 ? Math.round((approvedDrafts / drafts.length) * 100) : 0;

  // Load feedback analytics
  useEffect(() => {
    const loadFeedbackStats = async () => {
      const { data: feedbackData } = await supabase
        .from('draft_feedback')
        .select('rating');
      
      if (feedbackData && feedbackData.length > 0) {
        const ratings = feedbackData.map(f => f.rating).filter(r => r !== null);
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        setAvgRating(Number(avg.toFixed(1)));
        setFeedbackCount(feedbackData.length);
      }
    };

    loadFeedbackStats();
  }, [drafts]);

  const handleGenerateDraft = () => {
    generateDraft();
    toast({
      title: "Draft Generated!",
      description: "Your new newsletter draft is ready for review.",
    });
    navigate("/drafts");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-background p-8 border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(262_83%_58%/0.1),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Good morning! ☀️</h1>
              <p className="text-lg text-muted-foreground">
                {latestDraft 
                  ? "Your newsletter draft is ready for review" 
                  : "Generate your first newsletter draft"}
              </p>
            </div>
            {latestDraft && latestDraft.status === 'draft' && (
              <Badge className="bg-accent text-accent-foreground">Next delivery in 18h</Badge>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <Button size="lg" className="gap-2" onClick={() => navigate("/drafts")}>
              <FileText className="h-4 w-4" />
              {latestDraft ? 'Review Draft' : 'View Drafts'}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={handleGenerateDraft}>
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
            <div className="text-2xl font-bold">{acceptanceRate}%</div>
            <p className="text-xs text-muted-foreground">drafts approved with minimal edits</p>
            <Progress value={acceptanceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Draft Rating</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating > 0 ? avgRating : '--'} / 5</div>
            <p className="text-xs text-muted-foreground">{feedbackCount} feedback submissions</p>
            {avgRating > 0 && <Progress value={(avgRating / 5) * 100} className="mt-2" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletters Sent</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drafts.filter(d => d.status === 'sent').length}</div>
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
          {drafts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No drafts yet. Generate your first one!</p>
              <Button onClick={handleGenerateDraft} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Draft
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.slice(-3).reverse().map((draft) => (
                <div key={draft.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{draft.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        Generated {new Date(draft.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={draft.status === "reviewed" ? "default" : "secondary"}>
                      {draft.status === 'draft' ? 'Ready' : draft.status === 'reviewed' ? 'Approved' : 'Sent'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/drafts")}>View</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {trends.length === 0 ? (
            <p className="text-sm text-muted-foreground">No trends detected yet. Add sources to start tracking trends.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trends.slice(0, 6).map((trend) => (
                <Badge
                  key={trend.id}
                  variant="outline"
                  className="px-3 py-1.5 text-sm"
                  style={{
                    background: `linear-gradient(135deg, hsl(38 92% 50% / ${trend.sentiment}), hsl(45 98% 55% / ${trend.sentiment}))`,
                    borderColor: `hsl(38 92% 50% / ${trend.sentiment})`,
                  }}
                >
                  🔥 {trend.title}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
