import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Users, 
  FileText, 
  Award, 
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2
} from "lucide-react";

interface JobSeaDashboardProps {
  userId: string;
  profile: any;
}

export default function JobSeaDashboard({ userId, profile }: JobSeaDashboardProps) {
  const [stats, setStats] = useState({
    watchlistedCompanies: 0,
    followedVoices: 0,
    savedCVs: 0,
    certificatesInProgress: 0,
    certificatesCompleted: 0,
    unreadNotifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const [
        companiesResult,
        voicesResult,
        cvsResult,
        certsResult,
        notificationsResult
      ] = await Promise.all([
        supabase.from('jobsea_user_companies').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('jobsea_user_voices').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('jobsea_cvs').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('jobsea_cert_progress').select('status').eq('user_id', userId),
        supabase.from('jobsea_notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_read', false)
      ]);

      const certsInProgress = certsResult.data?.filter(c => c.status === 'enrolled').length || 0;
      const certsCompleted = certsResult.data?.filter(c => c.status === 'passed').length || 0;

      setStats({
        watchlistedCompanies: companiesResult.count || 0,
        followedVoices: voicesResult.count || 0,
        savedCVs: cvsResult.count || 0,
        certificatesInProgress: certsInProgress,
        certificatesCompleted: certsCompleted,
        unreadNotifications: notificationsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const profileCompleteness = () => {
    let score = 40; // Base score for completing onboarding
    if (stats.watchlistedCompanies > 0) score += 15;
    if (stats.followedVoices > 0) score += 15;
    if (stats.savedCVs > 0) score += 20;
    if (stats.certificatesInProgress > 0 || stats.certificatesCompleted > 0) score += 10;
    return Math.min(score, 100);
  };

  const completeness = profileCompleteness();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Completeness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Profile Completeness
          </CardTitle>
          <CardDescription>
            Complete your profile to maximize your job search effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold">{completeness}%</span>
            </div>
            <Progress value={completeness} className="h-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={`h-4 w-4 ${stats.watchlistedCompanies > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span>Companies Added</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={`h-4 w-4 ${stats.followedVoices > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span>Voices Followed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={`h-4 w-4 ${stats.savedCVs > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span>CV Created</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={`h-4 w-4 ${stats.certificatesInProgress > 0 || stats.certificatesCompleted > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span>Certs Tracked</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Career Path
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Badge variant="default" className="mt-1">Dream</Badge>
              <div>
                <p className="font-medium">{profile.dream_job}</p>
                <p className="text-sm text-muted-foreground">Your ultimate career goal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-1">Target</Badge>
              <div>
                <p className="font-medium">{profile.realistic_job}</p>
                <p className="text-sm text-muted-foreground">Achievable next role</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">Backup</Badge>
              <div>
                <p className="font-medium">{profile.worst_job}</p>
                <p className="text-sm text-muted-foreground">Safety net option</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchlisted Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.watchlistedCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Target companies you're tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Voices</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.followedVoices}/2</div>
            <p className="text-xs text-muted-foreground">
              Influential voices you follow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved CVs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedCVs}</div>
            <p className="text-xs text-muted-foreground">
              Resume versions created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Tracking</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.certificatesInProgress}
              <span className="text-sm text-muted-foreground"> / {stats.certificatesCompleted} ✓</span>
            </div>
            <p className="text-xs text-muted-foreground">
              In progress / Completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              Unread job market updates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geography Focus</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.geography}</div>
            <p className="text-xs text-muted-foreground">
              Your target location
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
