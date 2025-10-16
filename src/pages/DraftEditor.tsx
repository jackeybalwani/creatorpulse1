import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ThumbsDown, Send, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DraftEditor = () => {
  const { drafts, trends, updateDraft, sendDraft } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const latestDraft = drafts[drafts.length - 1];
  const [subject, setSubject] = useState(latestDraft?.subject || '');
  const [content, setContent] = useState(latestDraft?.content || '');

  useEffect(() => {
    if (latestDraft) {
      setSubject(latestDraft.subject);
      setContent(latestDraft.content);
    }
  }, [latestDraft]);

  if (!latestDraft) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No drafts available yet.</p>
            <Button onClick={() => navigate("/")}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Your First Draft
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    updateDraft(latestDraft.id, { subject, content });
    toast({
      title: "Draft Saved!",
      description: "Your changes have been saved.",
    });
  };

  const handleApprove = () => {
    updateDraft(latestDraft.id, { 
      status: 'reviewed',
      subject, 
      content,
      feedback: {
        rating: feedback === 'up' ? 5 : 3,
        comments: feedback === 'up' ? 'Good draft' : 'Needs improvement',
        improvements: [],
      }
    });
    toast({
      title: "Draft Approved!",
      description: "Your newsletter has been scheduled for delivery.",
    });
    navigate("/");
  };

  const handleSend = async () => {
    setIsSending(true);
    await sendDraft(latestDraft.id);
    setIsSending(false);
    navigate("/");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Draft Editor</h1>
          <p className="text-muted-foreground mt-1">Review and edit your AI-generated newsletter</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            Scheduled: {new Date(latestDraft.scheduledFor).toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* AI Generation Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">AI-Generated Draft</p>
            <p className="text-sm text-muted-foreground">Based on {trends.length} trending topics detected</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={feedback === "up" ? "default" : "outline"}
              size="sm"
              onClick={() => setFeedback("up")}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Good
            </Button>
            <Button
              variant={feedback === "down" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setFeedback("down")}
              className="gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Needs Work
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Content */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Content</CardTitle>
          <CardDescription>Edit the subject line and body of your newsletter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject Line */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject Line</label>
            <Textarea
              className="resize-none font-medium"
              rows={2}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <Separator />

          {/* Main Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              className="resize-none min-h-[500px] font-mono text-sm"
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Trends Used */}
      {latestDraft.trendIds.length > 0 && (
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Trends Included
            </CardTitle>
            <CardDescription>These trending topics were used to generate this draft</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trends
                .filter(t => latestDraft.trendIds.includes(t.id))
                .map(trend => (
                  <Badge key={trend.id} variant="outline">
                    {trend.title}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between p-6 rounded-lg border bg-card">
        <div>
          <p className="font-medium">Ready to send?</p>
          <p className="text-sm text-muted-foreground">
            Send now or approve for scheduled delivery
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={handleSave}>
            Save Draft
          </Button>
          <Button variant="outline" size="lg" className="gap-2" onClick={handleApprove}>
            Approve & Schedule
          </Button>
          <Button size="lg" className="gap-2" onClick={handleSend} disabled={isSending}>
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftEditor;
