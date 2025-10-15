import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Flame, Eye, Clock } from "lucide-react";

const Trends = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trending Topics</h1>
        <p className="text-muted-foreground mt-1">Emerging trends detected from your 12 sources</p>
      </div>

      {/* Top Trends */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-accent/50 bg-gradient-to-br from-accent/10 to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hottest Topic</CardTitle>
            <Flame className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AI Agents</div>
            <p className="text-xs text-muted-foreground">95% heat score</p>
            <Progress value={95} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rising Fast</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Video AI</div>
            <p className="text-xs text-muted-foreground">+42% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Tracked</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">across all sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics List */}
      <Card>
        <CardHeader>
          <CardTitle>All Trending Topics</CardTitle>
          <CardDescription>Ranked by detection frequency and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                topic: "AI Agents & Autonomous Systems", 
                heat: 95, 
                mentions: 142, 
                trend: "up", 
                change: "+28%",
                sources: ["Twitter", "YouTube", "RSS"],
                timeframe: "Last 7 days"
              },
              { 
                topic: "GPT-5 Development & Rumors", 
                heat: 87, 
                mentions: 98, 
                trend: "up", 
                change: "+15%",
                sources: ["Twitter", "RSS"],
                timeframe: "Last 3 days"
              },
              { 
                topic: "Creator Economy Tools", 
                heat: 76, 
                mentions: 76, 
                trend: "up", 
                change: "+12%",
                sources: ["YouTube", "RSS"],
                timeframe: "Last 7 days"
              },
              { 
                topic: "Web3 & Blockchain Revival", 
                heat: 68, 
                mentions: 54, 
                trend: "up", 
                change: "+8%",
                sources: ["Twitter"],
                timeframe: "Last 14 days"
              },
              { 
                topic: "Video Generation AI", 
                heat: 62, 
                mentions: 89, 
                trend: "up", 
                change: "+42%",
                sources: ["YouTube", "Twitter"],
                timeframe: "Last 7 days"
              },
              { 
                topic: "Open Source LLM Progress", 
                heat: 58, 
                mentions: 67, 
                trend: "up", 
                change: "+5%",
                sources: ["Twitter", "RSS"],
                timeframe: "Last 7 days"
              },
              { 
                topic: "AI Safety & Ethics Debates", 
                heat: 52, 
                mentions: 45, 
                trend: "neutral", 
                change: "+2%",
                sources: ["Twitter", "RSS"],
                timeframe: "Last 30 days"
              },
              { 
                topic: "Multimodal AI Models", 
                heat: 48, 
                mentions: 38, 
                trend: "up", 
                change: "+7%",
                sources: ["YouTube"],
                timeframe: "Last 7 days"
              },
              { 
                topic: "AI Regulation & Policy", 
                heat: 44, 
                mentions: 32, 
                trend: "down", 
                change: "-3%",
                sources: ["RSS"],
                timeframe: "Last 30 days"
              },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{item.topic}</h3>
                      <Badge 
                        variant="outline" 
                        className="gap-1"
                        style={{
                          background: `linear-gradient(135deg, hsl(38 92% 50% / ${item.heat / 100}), hsl(45 98% 55% / ${item.heat / 100}))`,
                          borderColor: `hsl(38 92% 50% / ${item.heat / 100})`,
                        }}
                      >
                        <Flame className="h-3 w-3" />
                        {item.heat}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.mentions} mentions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.timeframe}
                      </span>
                      <div className="flex gap-1">
                        {item.sources.map((source, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {item.trend === "up" ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : item.trend === "down" ? (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                    <span className={`text-sm font-medium ${
                      item.trend === "up" ? "text-success" : 
                      item.trend === "down" ? "text-destructive" : 
                      "text-muted-foreground"
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
                <Progress value={item.heat} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
