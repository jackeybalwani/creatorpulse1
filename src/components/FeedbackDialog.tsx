import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: { rating: number; comments: string }) => void;
  initialRating?: "up" | "down" | null;
}

export const FeedbackDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  initialRating 
}: FeedbackDialogProps) => {
  const [rating, setRating] = useState<number>(initialRating === "up" ? 5 : initialRating === "down" ? 2 : 3);
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    onSubmit({ rating, comments });
    setComments("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Provide Feedback on Draft Quality</DialogTitle>
          <DialogDescription>
            Help us improve future drafts by rating this newsletter and sharing your thoughts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Overall Quality</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {rating === 1 && "Poor - Needs significant improvement"}
              {rating === 2 && "Below Average - Major edits needed"}
              {rating === 3 && "Average - Some edits required"}
              {rating === 4 && "Good - Minor tweaks only"}
              {rating === 5 && "Excellent - Ready to send!"}
            </p>
          </div>

          {/* Quick Feedback Buttons */}
          <div className="space-y-2">
            <Label>Quick Feedback</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={rating >= 4 ? "default" : "outline"}
                size="sm"
                onClick={() => setRating(5)}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Great Draft
              </Button>
              <Button
                type="button"
                variant={rating <= 2 ? "destructive" : "outline"}
                size="sm"
                onClick={() => setRating(2)}
                className="gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                Needs Work
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">
              Additional Comments <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="comments"
              placeholder="What worked well? What could be improved? Any specific feedback on tone, structure, or content?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
