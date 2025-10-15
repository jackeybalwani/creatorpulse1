import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Clock, Mail, FileText, Sparkles, Save } from "lucide-react";

const Settings = () => {
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
          <CardDescription>When and how you receive your newsletter drafts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="delivery-time">Daily Delivery Time</Label>
              <Input id="delivery-time" type="time" defaultValue="08:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (London)</option>
                <option>UTC+1 (Paris)</option>
              </select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekend Delivery</Label>
                <p className="text-sm text-muted-foreground">Generate drafts on Saturdays and Sundays</p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Approve Drafts</Label>
                <p className="text-sm text-muted-foreground">Automatically send when acceptance rate is high</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
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
          <CardDescription>Configure your delivery email service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sender-email">Sender Email Address</Label>
            <Input id="sender-email" type="email" placeholder="your-newsletter@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender-name">Sender Name</Label>
            <Input id="sender-name" placeholder="Your Newsletter" />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="email-service">Email Service</Label>
            <select
              id="email-service"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Gmail SMTP (Free)</option>
              <option>MailerSend (Free Tier)</option>
              <option>SendGrid (Free Tier)</option>
            </select>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Using free-tier email service. Limited to 100 emails/day.
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
          <CardDescription>Upload past newsletters to train the AI on your style</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tone & Style</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Professional & Informative</option>
              <option>Casual & Friendly</option>
              <option>Technical & In-depth</option>
              <option>Conversational & Story-driven</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sample-newsletters">Sample Newsletters</Label>
            <Textarea
              id="sample-newsletters"
              placeholder="Paste your previous newsletters here (one per line or separated by ---)"
              className="min-h-[150px]"
            />
            <p className="text-sm text-muted-foreground">
              Provide at least 3-5 past newsletters for best results
            </p>
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Short (500-800 words)</option>
              <option selected>Medium (800-1200 words)</option>
              <option>Long (1200-2000 words)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trend-threshold">Trend Detection Sensitivity</Label>
            <div className="flex items-center gap-4">
              <input
                id="trend-threshold"
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                className="flex-1"
              />
              <span className="text-sm font-medium">70%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Higher = Only include highly trending topics
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include "Trends to Watch" Section</Label>
              <p className="text-sm text-muted-foreground">Add emerging trends block to drafts</p>
            </div>
            <Switch defaultChecked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Source Attribution</Label>
              <p className="text-sm text-muted-foreground">Include links to original sources</p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
