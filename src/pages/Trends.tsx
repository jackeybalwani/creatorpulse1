import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, TrendingDown, Flame, Eye, Clock, RefreshCw, Sparkles } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Trends = () => {
  const { trends, refreshTrends, generateDraft } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTrendIds, setSelectedTrendIds] = useState<string[]>([]);

  const handleRefresh = () => {
    refreshTrends();
    toast({
      title: "Trends Refreshed!",
      description: "New trending topics have been detected.",
    });
  };

  const handleToggleTrend = (trendId: string) => {
    setSelectedTrendIds(prev => 
      prev.includes(trendId) 
        ? prev.filter(id => id !== trendId)
        : [...prev, trendId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrendIds.length === trends.length) {
      setSelectedTrendIds([]);
    } else {
      setSelectedTrendIds(trends.map(t => t.id));
    }
  };

  const handleGenerateDraft = async () => {
    if (selectedTrendIds.length === 0) {
      toast({
        title: "No trends selected",
        description: "Please select at least one trend to generate a draft",
        variant: "destructive",
      });
      return;
    }

    await generateDraft({ selectedTrends: selectedTrendIds });
    setSelectedTrendIds([]);
    navigate('/');
  };

  const topTrend = trends.length > 0 ? trends.reduce((max, t) => t.mentions > max.mentions ? t : max, trends[0]) : null;
  const risingTrend = trends.length > 0 ? trends.reduce((max, t) => t.sentiment > max.sentiment ? t : max, trends[0]) : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trending Topics</h1>
          <p className="text-muted-foreground mt-1">
            {selectedTrendIds.length > 0 
              ? `${selectedTrendIds.length} trend${selectedTrendIds.length > 1 ? 's' : ''} selected`
              : "Select trends to generate a personalized draft"
            }
          </p>
        </div>
        <div className="flex gap-2">
          {selectedTrendIds.length > 0 && (
            <Button onClick={handleGenerateDraft} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Draft ({selectedTrendIds.length})
            </Button>
          )}
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Top Trends */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-accent/50 bg-gradient-to-br from-accent/10 to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hottest Topic</CardTitle>
            <Flame className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topTrend?.title || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{topTrend?.mentions || 0} mentions</p>
            <Progress value={(topTrend?.mentions || 0) * 3} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rising Fast</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risingTrend?.title || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {risingTrend ? `${Math.round(risingTrend.sentiment * 100)}% positive` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Tracked</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trends.length}</div>
            <p className="text-xs text-muted-foreground">across all sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Trending Topics</CardTitle>
              <CardDescription>Ranked by detection frequency and engagement</CardDescription>
            </div>
            {trends.length > 0 && (
              <Button onClick={handleSelectAll} variant="outline" size="sm">
                {selectedTrendIds.length === trends.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {trends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No trends detected yet. Add sources to start tracking trends.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trends.map((trend) => {
                const heatScore = Math.min(Math.round((trend.mentions / Math.max(...trends.map(t => t.mentions))) * 100), 100);
                const sentimentPercent = Math.round(trend.sentiment * 100);
                
                return (
                  <div 
                    key={trend.id} 
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      selectedTrendIds.includes(trend.id) 
                        ? 'bg-accent/20 border-primary' 
                        : 'bg-card hover:bg-accent/5'
                    }`}
                    onClick={() => handleToggleTrend(trend.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox 
                          checked={selectedTrendIds.includes(trend.id)}
                          onCheckedChange={() => handleToggleTrend(trend.id)}
                          className="mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{trend.title}</h3>
                          <Badge 
                            variant="outline" 
                            className="gap-1"
                            style={{
                              background: `linear-gradient(135deg, hsl(38 92% 50% / ${heatScore / 100}), hsl(45 98% 55% / ${heatScore / 100}))`,
                              borderColor: `hsl(38 92% 50% / ${heatScore / 100})`,
                            }}
                          >
                            <Flame className="h-3 w-3" />
                            {heatScore}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{trend.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {trend.mentions} mentions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(trend.detectedAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {trend.category}
                          </Badge>
                        </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {sentimentPercent > 50 ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className={`text-sm font-medium ${
                          sentimentPercent > 50 ? "text-success" : "text-muted-foreground"
                        }`}>
                          {sentimentPercent > 50 ? '+' : ''}{sentimentPercent}%
                        </span>
                      </div>
                    </div>
                    <Progress value={heatScore} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
