import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, FileText } from "lucide-react";

interface DiffViewerProps {
  originalSubject: string;
  editedSubject: string;
  originalContent: string;
  editedContent: string;
}

export const DiffViewer = ({ 
  originalSubject, 
  editedSubject, 
  originalContent, 
  editedContent 
}: DiffViewerProps) => {
  const subjectChanged = originalSubject !== editedSubject;
  const contentChanged = originalContent !== editedContent;
  
  // Simple diff calculation
  const calculateWordChanges = (original: string, edited: string) => {
    const originalWords = original.split(/\s+/).length;
    const editedWords = edited.split(/\s+/).length;
    const difference = editedWords - originalWords;
    const percentChange = originalWords > 0 ? Math.round((Math.abs(difference) / originalWords) * 100) : 0;
    
    return { originalWords, editedWords, difference, percentChange };
  };

  const contentStats = calculateWordChanges(originalContent, editedContent);

  return (
    <Card className="border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          Content Changes
        </CardTitle>
        <CardDescription>
          Review the differences between AI-generated and edited versions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Change Summary */}
        <div className="flex gap-4 p-4 rounded-lg bg-muted/50">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Subject Line</p>
            {subjectChanged ? (
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Modified
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-success" />
                Unchanged
              </Badge>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Content</p>
            {contentChanged ? (
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {contentStats.percentChange}% changed ({contentStats.difference > 0 ? '+' : ''}{contentStats.difference} words)
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-success" />
                Unchanged
              </Badge>
            )}
          </div>
        </div>

        {/* Diff Tabs */}
        <Tabs defaultValue="subject" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subject">Subject Line</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subject" className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">ORIGINAL (AI)</p>
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm">{originalSubject}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">EDITED (YOU)</p>
              <div className="p-3 rounded-md bg-success/10 border border-success/20">
                <p className="text-sm">{editedSubject}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">ORIGINAL (AI) - {contentStats.originalWords} words</p>
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 max-h-[300px] overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-sans">{originalContent}</pre>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">EDITED (YOU) - {contentStats.editedWords} words</p>
              <div className="p-3 rounded-md bg-success/10 border border-success/20 max-h-[300px] overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-sans">{editedContent}</pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
