import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  profile_image_url: string | null;
  scraped_at: string;
}

interface LinkedInProfilesListProps {
  userId: string;
}

export default function LinkedInProfilesList({ userId }: LinkedInProfilesListProps) {
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('jobsea_linkedin_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('scraped_at', { ascending: false });

      if (error) throw error;

      setProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load LinkedIn profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('jobsea_linkedin_profiles')
        .delete()
        .eq('id', profileId)
        .eq('user_id', userId);

      if (error) throw error;

      setProfiles(profiles.filter(p => p.id !== profileId));
      
      toast({
        title: "Profile Deleted",
        description: "LinkedIn profile has been removed",
      });
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProfiles();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('linkedin_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobsea_linkedin_profiles',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (profiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scraped Profiles</CardTitle>
          <CardDescription>No LinkedIn profiles scraped yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scraped Profiles ({profiles.length})</CardTitle>
        <CardDescription>Your collection of scraped LinkedIn profiles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            {profile.profile_image_url && (
              <img
                src={profile.profile_image_url}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="h-16 w-16 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg truncate">
                    {profile.first_name} {profile.last_name}
                  </h4>
                  {profile.headline && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {profile.headline}
                    </p>
                  )}
                  {profile.location && (
                    <p className="text-xs text-muted-foreground mt-1">{profile.location}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open LinkedIn profile"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Delete profile">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this scraped profile? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(profile.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {profile.connections_count && (
                  <Badge variant="secondary" className="text-xs">
                    {profile.connections_count.toLocaleString()} connections
                  </Badge>
                )}
                {profile.followers_count && (
                  <Badge variant="secondary" className="text-xs">
                    {profile.followers_count.toLocaleString()} followers
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Scraped: {new Date(profile.scraped_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
