import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";
import { Trend } from "@/lib/types";

interface DraftConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trends: Trend[];
  onGenerate: (config: DraftConfig) => void;
  isGenerating?: boolean;
}

export interface DraftConfig {
  subjectLine: string;
  tone: string;
  length: string;
  writingStyle: string;
  selectedTrends: string[];
  topics: string[];
  includeImages: boolean;
  includeLinks: boolean;
}

export const DraftConfigDialog = ({ 
  open, 
  onOpenChange, 
  trends, 
  onGenerate,
  isGenerating = false 
}: DraftConfigDialogProps) => {
  const [config, setConfig] = useState<DraftConfig>({
    subjectLine: "",
    tone: "professional",
    length: "medium",
    writingStyle: "Clear, engaging, and informative with a professional tone",
    selectedTrends: trends.slice(0, 4).map(t => t.id),
    topics: ["AI", "Technology", "Innovation"],
    includeImages: true,
    includeLinks: true,
  });

  // Auto-generate subject line suggestion based on top trend
  useEffect(() => {
    if (trends.length > 0 && !config.subjectLine) {
      const topTrend = trends[0];
      setConfig(prev => ({
        ...prev,
        subjectLine: `This Week: ${topTrend.title} & More`
      }));
    }
  }, [trends]);

  const handleTrendToggle = (trendId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedTrends: prev.selectedTrends.includes(trendId)
        ? prev.selectedTrends.filter(id => id !== trendId)
        : [...prev.selectedTrends, trendId]
    }));
  };

  const handleGenerate = () => {
    onGenerate(config);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Configure Your Newsletter Draft
          </DialogTitle>
          <DialogDescription>
            Customize every aspect of your AI-generated newsletter before creation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Subject Line */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-base font-semibold">Subject Line</Label>
            <Input
              id="subject"
              value={config.subjectLine}
              onChange={(e) => setConfig({ ...config, subjectLine: e.target.value })}
              placeholder="Enter newsletter subject..."
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Keep it under 60 characters for best email open rates
            </p>
          </div>

          {/* Tone & Length */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-base font-semibold">Tone</Label>
              <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-base font-semibold">Newsletter Length</Label>
              <Select value={config.length} onValueChange={(value) => setConfig({ ...config, length: value as 'short' | 'medium' | 'long' })}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (~500 words)</SelectItem>
                  <SelectItem value="medium">Medium (~1000 words)</SelectItem>
                  <SelectItem value="long">Long (~1500+ words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Writing Style */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-base font-semibold">Writing Style</Label>
            <Textarea
              id="style"
              value={config.writingStyle}
              onChange={(e) => setConfig({ ...config, writingStyle: e.target.value })}
              placeholder="Describe your preferred writing style..."
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              Example: "Clear, engaging, and informative with a professional tone"
            </p>
          </div>

          {/* Select Trends */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Select Trends to Include
              </Label>
              <span className="text-sm text-muted-foreground">
                {config.selectedTrends.length} selected
              </span>
            </div>
            <div className="grid gap-3 max-h-[300px] overflow-y-auto p-1">
              {trends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No trends available. Add sources to detect trends.
                </p>
              ) : (
                trends.map((trend) => (
                  <div
                    key={trend.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <Checkbox
                      id={trend.id}
                      checked={config.selectedTrends.includes(trend.id)}
                      onCheckedChange={() => handleTrendToggle(trend.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={trend.id}
                        className="font-medium text-sm leading-none cursor-pointer"
                      >
                        {trend.title}
                      </label>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {trend.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {trend.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {trend.mentions} mentions
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <Label className="text-base font-semibold">Additional Options</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="images"
                  checked={config.includeImages}
                  onCheckedChange={(checked) => 
                    setConfig({ ...config, includeImages: checked as boolean })
                  }
                />
                <label htmlFor="images" className="text-sm cursor-pointer">
                  Include image suggestions in newsletter
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="links"
                  checked={config.includeLinks}
                  onCheckedChange={(checked) => 
                    setConfig({ ...config, includeLinks: checked as boolean })
                  }
                />
                <label htmlFor="links" className="text-sm cursor-pointer">
                  Include relevant links and CTAs
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Draft will be created with {config.selectedTrends.length} trend{config.selectedTrends.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !config.subjectLine || config.selectedTrends.length === 0}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Draft'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
