import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, ExternalLink, TrendingUp, Info, Award, Briefcase, Target } from "lucide-react";

interface TopVoicesProps {
  userId: string;
  userPreferences?: any;
}

export default function TopVoices({ userId, userPreferences }: TopVoicesProps) {
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoices, setSelectedVoices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVoices();
    fetchSelectedVoices();
  }, [userPreferences]);

  const fetchVoices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('jobsea_voices')
        .select('*')
        .order('engagement_30d', { ascending: false });

      // Build filters based on user preferences for personalized recommendations
      const filters: string[] = [];
      
      // Filter by industry preferences (branches)
      if (userPreferences?.financialInterests && userPreferences.financialInterests.length > 0) {
        const industryFilters = userPreferences.financialInterests.map((interest: string) => 
          `company.ilike.%${interest}%,title.ilike.%${interest}%`
        );
        filters.push(...industryFilters);
      }
      
      // Filter by dream/realistic job titles
      if (userPreferences?.dreamJob) {
        filters.push(`title.ilike.%${userPreferences.dreamJob}%`);
      }
      if (userPreferences?.realisticJob) {
        filters.push(`title.ilike.%${userPreferences.realisticJob}%`);
      }
      
      // Apply filters if any exist
      if (filters.length > 0) {
        query = query.or(filters.join(','));
      }

      const { data, error } = await query.limit(24);

      if (error) throw error;
      setVoices(data || []);
    } catch (error: any) {
      console.error('Error fetching voices:', error);
      toast({
        title: "Error",
        description: "Failed to load industry voices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedVoices = async () => {
    try {
      const { data, error } = await supabase
        .from('jobsea_user_voices')
        .select('voice_id')
        .eq('user_id', userId);

      if (error) throw error;
      setSelectedVoices(data?.map(v => v.voice_id) || []);
    } catch (error) {
      console.error('Error fetching selected voices:', error);
    }
  };

  const handleToggleVoice = async (voiceId: string) => {
    const isSelected = selectedVoices.includes(voiceId);

    if (isSelected) {
      // Unfollow
      try {
        const { error } = await supabase
          .from('jobsea_user_voices')
          .delete()
          .eq('user_id', userId)
          .eq('voice_id', voiceId);

        if (error) throw error;

        setSelectedVoices(prev => prev.filter(id => id !== voiceId));
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this voice",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to unfollow voice",
          variant: "destructive"
        });
      }
    } else {
      // Follow
      if (selectedVoices.length >= 2) {
        toast({
          title: "Limit Reached",
          description: "You can only follow up to 2 voices. Unfollow one to select another.",
          variant: "destructive"
        });
        return;
      }

      try {
        const { error } = await supabase
          .from('jobsea_user_voices')
          .insert({
            user_id: userId,
            voice_id: voiceId
          });

        if (error) throw error;

        setSelectedVoices(prev => [...prev, voiceId]);
        toast({
          title: "Following",
          description: "You are now following this voice",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to follow voice",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading industry voices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Industry Voices
        </CardTitle>
        <CardDescription>
          Follow up to 2 influential voices from your target companies ({selectedVoices.length}/2 selected)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voices.map((voice) => {
            const isSelected = selectedVoices.includes(voice.id);
            
            return (
              <Card 
                key={voice.id} 
                className={`cursor-pointer hover:shadow-lg transition-shadow ${isSelected ? "border-primary" : ""}`}
                onClick={() => {
                  setSelectedVoice(voice);
                  setIsDetailsOpen(true);
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={voice.avatar_url} alt={voice.name} />
                      <AvatarFallback>{voice.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{voice.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{voice.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{voice.company}</p>
                    </div>
                  </div>

                  {voice.bio && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {voice.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {(voice.followers / 1000000).toFixed(1)}M followers
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {(voice.engagement_30d / 1000).toFixed(0)}K eng.
                    </Badge>
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVoice(voice.id);
                      }}
                    >
                      {isSelected ? "Following" : "Follow"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.linkedin.com/in/${voice.linkedin_id}`, '_blank');
                      }}
                      title="View on LinkedIn"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {voices.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No industry voices available yet.</p>
          </div>
        )}
      </CardContent>

      {/* Voice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedVoice && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedVoice.avatar_url} alt={selectedVoice.name} />
                    <AvatarFallback className="text-xl">
                      {selectedVoice.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedVoice.name}</DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      <div>{selectedVoice.title}</div>
                      <div className="text-muted-foreground">{selectedVoice.company}</div>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Bio */}
                {selectedVoice.bio && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      About
                    </h3>
                    <p className="text-muted-foreground">{selectedVoice.bio}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">
                        {(selectedVoice.followers / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-muted-foreground">LinkedIn Followers</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">
                        {(selectedVoice.engagement_30d / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-muted-foreground">30-Day Engagement</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notable Achievements */}
                {selectedVoice.notable_achievements && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Notable Achievements
                    </h3>
                    <p className="text-muted-foreground">{selectedVoice.notable_achievements}</p>
                  </div>
                )}

                {/* Content Focus */}
                {selectedVoice.content_focus && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Content Focus
                    </h3>
                    <p className="text-muted-foreground">{selectedVoice.content_focus}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    className="flex-1"
                    variant={selectedVoices.includes(selectedVoice.id) ? "secondary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVoice(selectedVoice.id);
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {selectedVoices.includes(selectedVoice.id) ? 'Unfollow' : 'Follow Voice'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.linkedin.com/in/${selectedVoice.linkedin_id}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on LinkedIn
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}