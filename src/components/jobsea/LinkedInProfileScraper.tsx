import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LinkedInProfile {
  id: string;
  linkedin_url: string;
  public_identifier: string | null;
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  location: string | null;
  connections_count: number | null;
  followers_count: number | null;
  summary: string | null;
  profile_image_url: string | null;
  scraped_at: string;
}

interface LinkedInProfileScraperProps {
  userId: string;
  onProfileScraped?: (profile: LinkedInProfile) => void;
}

export default function LinkedInProfileScraper({ userId, onProfileScraped }: LinkedInProfileScraperProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedProfile, setScrapedProfile] = useState<LinkedInProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
    return linkedInPattern.test(url);
  };

  const handleScrape = async () => {
    setError(null);
    setScrapedProfile(null);

    if (!linkedinUrl) {
      setError("Please enter a LinkedIn profile URL");
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      setError("Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to scrape profiles");
      }

      const response = await supabase.functions.invoke('scrape-linkedin-profile', {
        body: { linkedin_url: linkedinUrl },
      });

      if (response.error) {
        throw response.error;
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      const profile = response.data.profile;
      setScrapedProfile(profile);
      
      toast({
        title: "Profile Scraped Successfully",
        description: `Retrieved public data for ${profile.first_name} ${profile.last_name}`,
      });

      if (onProfileScraped) {
        onProfileScraped(profile);
      }

      setLinkedinUrl("");
    } catch (err: any) {
      console.error("Scraping error:", err);
      const errorMessage = err.message || "Failed to scrape LinkedIn profile";
      setError(errorMessage);
      
      toast({
        title: "Scraping Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            LinkedIn Profile Scraper
          </CardTitle>
          <CardDescription>
            Enter a public LinkedIn profile URL to scrape career information. Limited to 10 profiles per day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only public LinkedIn profiles can be scraped. This respects LinkedIn's robots.txt and rate limits. All data is for personal research purposes only.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleScrape} 
              disabled={isLoading || !linkedinUrl}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Scrape Profile
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scrapedProfile && (
            <Alert className="bg-success/10 border-success text-success-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-foreground">
                Successfully scraped profile for{" "}
                <strong>
                  {scrapedProfile.first_name} {scrapedProfile.last_name}
                </strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {scrapedProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Scraped Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              {scrapedProfile.profile_image_url && (
                <img
                  src={scrapedProfile.profile_image_url}
                  alt={`${scrapedProfile.first_name} ${scrapedProfile.last_name}`}
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold">
                  {scrapedProfile.first_name} {scrapedProfile.last_name}
                </h3>
                {scrapedProfile.headline && (
                  <p className="text-muted-foreground">{scrapedProfile.headline}</p>
                )}
                {scrapedProfile.location && (
                  <p className="text-sm text-muted-foreground">{scrapedProfile.location}</p>
                )}
                <div className="flex gap-2">
                  {scrapedProfile.connections_count && (
                    <Badge variant="secondary">
                      {scrapedProfile.connections_count} connections
                    </Badge>
                  )}
                  {scrapedProfile.followers_count && (
                    <Badge variant="secondary">
                      {scrapedProfile.followers_count} followers
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {scrapedProfile.summary && (
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground">{scrapedProfile.summary}</p>
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Public identifier: {scrapedProfile.public_identifier}</span>
              <span>Scraped: {new Date(scrapedProfile.scraped_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
