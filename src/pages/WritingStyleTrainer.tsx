import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function WritingStyleTrainer() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sentDate, setSentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [pastNewsletters, setPastNewsletters] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from('past_newsletters').insert({
        user_id: user.id,
        title,
        content,
        sent_date: sentDate || null,
      });

      if (error) throw error;

      toast({
        title: "Newsletter uploaded!",
        description: "Your writing style will be learned from this example",
      });

      // Reset form
      setTitle("");
      setContent("");
      setSentDate("");
      
      // Reload past newsletters
      loadPastNewsletters();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPastNewsletters = async () => {
    const { data } = await supabase
      .from('past_newsletters')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(10);
    
    if (data) setPastNewsletters(data);
  };

  const deleteNewsletter = async (id: string) => {
    const { error } = await supabase
      .from('past_newsletters')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({
        title: "Newsletter deleted",
        description: "The newsletter has been removed from your training data",
      });
      loadPastNewsletters();
    }
  };

  useEffect(() => {
    loadPastNewsletters();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Writing Style Trainer</h1>
          <p className="text-muted-foreground">
            Upload past newsletters to train the AI on your unique writing style
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Newsletter
            </CardTitle>
            <CardDescription>
              Paste your past newsletter content to help AI learn your style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Newsletter Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Weekly Tech Insights #42"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sentDate">Sent Date (Optional)</Label>
                <Input
                  id="sentDate"
                  type="date"
                  value={sentDate}
                  onChange={(e) => setSentDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Newsletter Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your full newsletter content here..."
                  className="min-h-[300px]"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Uploading..." : "Upload Newsletter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Training Library ({pastNewsletters.length})
            </CardTitle>
            <CardDescription>
              Your uploaded newsletters used for style training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastNewsletters.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No newsletters uploaded yet. Upload at least 3-5 past newsletters for best results.
                </p>
              ) : (
                pastNewsletters.map((newsletter) => (
                  <div
                    key={newsletter.id}
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{newsletter.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {newsletter.sent_date 
                          ? new Date(newsletter.sent_date).toLocaleDateString()
                          : 'No date'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {newsletter.content.length} characters
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNewsletter(newsletter.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
