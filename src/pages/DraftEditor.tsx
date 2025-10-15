import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ThumbsDown, Send, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";

const DraftEditor = () => {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

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
            Scheduled: Tomorrow 8:00 AM
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
            <p className="text-sm text-muted-foreground">Based on 12 sources • 6 trending topics detected</p>
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
              defaultValue="🚀 Weekly AI Roundup: GPT-5 Rumors, AI Agents Rise, and the Creator Economy Boom"
            />
          </div>

          <Separator />

          {/* Intro */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Introduction</label>
            <Textarea
              className="resize-none"
              rows={4}
              defaultValue="Hey there! 👋

This week has been absolutely wild in the AI space. From whispers about GPT-5 to the explosion of AI agents, there's so much happening. I've aggregated the most important developments from 12 of my favorite sources so you don't have to.

Let's dive in..."
            />
          </div>

          <Separator />

          {/* Main Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Main Content</label>
            <Textarea
              className="resize-none min-h-[300px]"
              rows={12}
              defaultValue="## 🔥 Top Stories This Week

### AI Agents Are Taking Over
The rise of autonomous AI agents is accelerating faster than anyone predicted. From coding assistants to customer service bots, we're seeing practical applications everywhere.

**Key Insights:**
- Major companies investing billions in agent frameworks
- Open-source community building accessible tools
- Real-world ROI now measured in weeks, not months

**Why it matters:** This isn't hype—agents are solving real problems today.

---

### GPT-5: Separating Fact from Fiction
Rumors are swirling about OpenAI's next flagship model. Here's what we actually know vs. speculation.

**Confirmed:**
- Training is ongoing with massive compute
- Focus on reasoning and reliability

**Speculation:**
- 10x parameter count (unlikely)
- Multimodal from the ground up (probable)

**My take:** Expect iterative improvements rather than a quantum leap.

---

### The Creator Economy Gets an AI Boost
Tools that once took teams to build are now accessible to solo creators. The democratization is real.

**Trending Tools:**
- AI video editors saving hours per project
- Voice cloning for multilingual content
- Auto-scheduling optimized by engagement data

This is just the beginning..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Trends to Watch Section */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Trends to Watch
          </CardTitle>
          <CardDescription>AI-curated emerging topics from your sources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            className="resize-none"
            rows={6}
            defaultValue="🔍 **Emerging Trends:**

• **Open Source LLM Momentum** - Community models closing the gap with proprietary ones
• **AI Regulation Heats Up** - EU AI Act implementation details emerging  
• **Video Generation Goes Mainstream** - Tools now accessible to everyday creators
• **RAG Architecture Evolution** - Better context management at scale
• **AI Safety Debates Intensify** - Industry split on approach"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between p-6 rounded-lg border bg-card">
        <div>
          <p className="font-medium">Ready to send?</p>
          <p className="text-sm text-muted-foreground">This draft will be delivered tomorrow at 8:00 AM</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            Save Draft
          </Button>
          <Button size="lg" className="gap-2">
            <Send className="h-4 w-4" />
            Approve & Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftEditor;
