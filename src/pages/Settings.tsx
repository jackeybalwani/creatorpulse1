import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Clock, Mail, FileText, Sparkles, Save } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { preferences, updatePreferences } = useApp();
  const { toast } = useToast();
  
  const [deliveryTime, setDeliveryTime] = useState(preferences.deliveryTime);
  const [emailAddress, setEmailAddress] = useState(preferences.emailAddress);
  const [writingStyle, setWritingStyle] = useState(preferences.writingStyle);
  const [tone, setTone] = useState(preferences.tone);
  const [length, setLength] = useState(preferences.length);

  const handleSave = () => {
    updatePreferences({
      deliveryTime,
      emailAddress,
      writingStyle,
      tone,
      length,
    });
    
    toast({
      title: "Settings Saved!",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your newsletter generation and delivery</p>
      </div>

      {/* Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Delivery Schedule
          </CardTitle>
          <CardDescription>When you receive your newsletter drafts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-time">Daily Delivery Time</Label>
            <Input 
              id="delivery-time" 
              type="time" 
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>Configure your delivery email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your-email@example.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Using free-tier email service. Drafts will be delivered to your inbox daily.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Writing Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Writing Style Training
          </CardTitle>
          <CardDescription>Configure the AI writing style for your newsletters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tone & Style</Label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="professional">Professional & Informative</option>
              <option value="casual">Casual & Friendly</option>
              <option value="technical">Technical & In-depth</option>
              <option value="conversational">Conversational & Story-driven</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="writing-style">Writing Style Description</Label>
            <Textarea
              id="writing-style"
              placeholder="Describe your preferred writing style..."
              className="min-h-[100px]"
              value={writingStyle}
              onChange={(e) => setWritingStyle(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="custom-instructions">Custom Instructions</Label>
            <Textarea
              id="custom-instructions"
              placeholder="e.g., 'Always include a question at the end', 'Use emoji sparingly', 'Focus on actionable insights'"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Configuration
          </CardTitle>
          <CardDescription>Customize AI draft generation behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="draft-length">Draft Length</Label>
            <select
              id="draft-length"
              value={length}
              onChange={(e) => setLength(e.target.value as 'short' | 'medium' | 'long')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="short">Short (500-800 words)</option>
              <option value="medium">Medium (800-1200 words)</option>
              <option value="long">Long (1200-2000 words)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
