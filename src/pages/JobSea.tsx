import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Building2, Users, FileText, Award, Bell, LogOut, BarChart3, Landmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "@/components/jobsea/OnboardingWizard";
import CompanyUniverse from "@/components/jobsea/CompanyUniverse";
import TopVoices from "@/components/jobsea/TopVoices";
import CVBuilder from "@/components/jobsea/CVBuilder";
import CertificatesTracker from "@/components/jobsea/CertificatesTracker";
import NotificationCenter from "@/components/jobsea/NotificationCenter";
import JobSeaDashboard from "@/components/jobsea/JobSeaDashboard";
import LinkedInProfileScraper from "@/components/jobsea/LinkedInProfileScraper";
import LinkedInProfilesList from "@/components/jobsea/LinkedInProfilesList";
import Targets from "@/components/jobsea/Targets";
import { UniversityPlatformManager } from "@/components/jobsea/UniversityPlatformManager";
import { PublicSectorTab } from "@/components/resources/PublicSectorTab";

export default function JobSea() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const { data: profileData, error: profileError } = await supabase
        .from('jobsea_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      setProfile(profileData);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    await checkUser();
    toast({
      title: "Welcome to JobSea™",
      description: "Your profile has been created successfully!",
    });
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been signed out of JobSea™",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading JobSea™...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6" />
            JobSea™ - Land Your Dream Finance Job
          </CardTitle>
          <CardDescription>
            Please log in to access JobSea™ features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            JobSea™ helps finance professionals land their dream jobs through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-6">
            <li>AI-powered company matching based on your preferences</li>
            <li>Industry voice tracking and insights</li>
            <li>Professional CV builder with ATS optimization</li>
            <li>Certificate recommendations and tracking</li>
            <li>Real-time job market notifications</li>
          </ul>
          <a
            href="/auth"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign In to Get Started
          </a>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BriefcaseBusiness className="h-8 w-8" />
            JobSea™
          </h1>
          <p className="text-muted-foreground mt-1">
            Land your dream finance job • {profile.branches.join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationCenter />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="targets" className="flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4" />
            Targets
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="voices" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Voices
          </TabsTrigger>
          <TabsTrigger value="cv" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            CV Builder
          </TabsTrigger>
          <TabsTrigger value="university" className="flex items-center gap-2">
            🏫
            Uni Jobs
          </TabsTrigger>
          <TabsTrigger value="publicsector" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Oposiciones
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <JobSeaDashboard userId={user.id} profile={profile} />
          <LinkedInProfileScraper userId={user.id} />
          <LinkedInProfilesList userId={user.id} />
        </TabsContent>

        <TabsContent value="targets" className="mt-6">
          <Targets userId={user.id} profile={profile} />
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <CompanyUniverse profile={profile} />
        </TabsContent>

        <TabsContent value="voices" className="mt-6">
          <TopVoices userId={user.id} userPreferences={profile} />
        </TabsContent>

        <TabsContent value="cv" className="mt-6">
          <CVBuilder userId={user.id} />
        </TabsContent>

        <TabsContent value="university" className="mt-6">
          <UniversityPlatformManager />
        </TabsContent>

        <TabsContent value="publicsector" className="mt-6">
          <PublicSectorTab />
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <CertificatesTracker userId={user.id} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View all your job market notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Your notification history will appear here once you start following voices.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}