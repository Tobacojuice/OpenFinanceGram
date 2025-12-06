import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SampleJobsSeeder from "./SampleJobsSeeder";
import {
  ExternalLink,
  Linkedin,
  Zap,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Bookmark,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface JobAlert {
  id: string;
  job_title: string;
  company: string;
  location: string;
  job_url: string;
  source: string;
  match_score: number;
  status: string;
  created_at: string;
  metadata: any;
}

interface TargetsProps {
  userId: string;
  profile: any;
}

export default function Targets({ userId, profile }: TargetsProps) {
  const [jobs, setJobs] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
    checkLinkedInConnection();
  }, [userId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('match_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Load jobs error:', error);
      toast({
        title: "Error",
        description: "Failed to load job recommendations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkLinkedInConnection = async () => {
    try {
      const { data } = await supabase
        .from('jobsea_profiles')
        .select('linkedin_connected, linkedin_url')
        .eq('user_id', userId)
        .single();
      
      setLinkedInConnected(data?.linkedin_connected || false);
    } catch (error) {
      console.error('Check LinkedIn error:', error);
    }
  };

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'applied') {
        updateData.applied_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('job_alerts')
        .update(updateData)
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, ...updateData }
          : job
      ));

      toast({
        title: "Status Updated",
        description: `Job marked as ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Update status error:', error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive"
      });
    }
  };

  const handleApplyToJob = (job: JobAlert) => {
    handleUpdateStatus(job.id, 'applied');
    if (job.job_url) {
      window.open(job.job_url, '_blank');
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case 'linkedin': return 'default';
      case 'aiapply': return 'secondary';
      case 'handshake': return 'outline';
      default: return 'outline';
    }
  };

  const JobCard = ({ job }: { job: JobAlert }) => {
    const matchColor = getMatchColor(job.match_score);
    
    return (
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{job.job_title}</CardTitle>
              <p className="text-muted-foreground mt-1">{job.company}</p>
            </div>
            <Badge variant={getSourceBadgeVariant(job.source)}>
              {job.source}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location || 'Remote'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(job.created_at).toLocaleDateString()}
            </div>
            {job.metadata?.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {job.metadata.salary}
              </div>
            )}
          </div>

          {job.metadata?.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.metadata.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Match Score:</span>
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-4 h-4 ${matchColor}`} />
                <span className={`font-bold ${matchColor}`}>
                  {(job.match_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {job.status === 'applied' && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                Applied
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(job.job_url || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.job_title + ' ' + job.company)}`, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Job
            </Button>
            
            {job.status === 'new' || job.status === 'viewed' ? (
              <>
                <Button 
                  size="sm" 
                  onClick={() => handleApplyToJob(job)}
                  className="flex-1"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUpdateStatus(job.id, 'saved')}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUpdateStatus(job.id, 'rejected')}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ message, submessage }: { message: string; submessage?: string }) => (
    <Card>
      <CardContent className="py-12 text-center">
        <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{message}</p>
        {submessage && (
          <p className="text-sm text-muted-foreground mt-2">{submessage}</p>
        )}
      </CardContent>
    </Card>
  );

  const filteredJobs = (status?: string) => {
    if (!status) return jobs.filter(j => j.status === 'new' || j.status === 'viewed');
    return jobs.filter(j => j.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading job recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Job Targets & AI Apply
          </h2>
          <p className="text-muted-foreground mt-1">
            Personalized job recommendations based on your profile
          </p>
        </div>
        
        <Button 
          onClick={loadJobs}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* AI Apply Integration Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            AI Apply Integration
          </CardTitle>
          <CardDescription>
            Automate your job applications with AI-powered tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your LinkedIn profile and let AI Apply automatically submit applications 
            to 100+ matching jobs. Works with Handshake, LinkedIn, and other platforms.
          </p>
          
          <div className="flex items-center gap-3 flex-wrap">
            {!linkedInConnected && (
              <Button 
                onClick={() => window.open('https://www.linkedin.com', '_blank')}
                className="gap-2"
              >
                <Linkedin className="w-4 h-4" />
                Connect LinkedIn
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => window.open('https://aiapply.co/es/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit AI Apply
            </Button>
            {linkedInConnected && (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                LinkedIn Connected
              </Badge>
            )}
          </div>

          <div className="bg-background/50 p-4 rounded-lg border space-y-2">
            <h4 className="font-semibold text-sm">How AI Apply Works:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Sync your profile with LinkedIn & Handshake
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                AI matches you with relevant finance jobs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Auto-submit applications with your CV and cover letter
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Track all applications in one dashboard
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Job Recommendations Tabs */}
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommended" className="gap-2">
            <Target className="w-4 h-4" />
            Recommended ({filteredJobs().length})
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="w-4 h-4" />
            Saved ({filteredJobs('saved').length})
          </TabsTrigger>
          <TabsTrigger value="applied" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Applied ({filteredJobs('applied').length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" />
            Rejected ({filteredJobs('rejected').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="mt-6">
          {filteredJobs().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs().map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <EmptyState 
                message="No job recommendations yet" 
                submessage="Add some sample jobs or connect your LinkedIn to get started"
              />
              <SampleJobsSeeder userId={userId} profile={profile} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          {filteredJobs('saved').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs('saved').map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="No saved jobs yet" 
              submessage="Click the bookmark icon on job cards to save them for later"
            />
          )}
        </TabsContent>
        
        <TabsContent value="applied" className="mt-6">
          {filteredJobs('applied').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs('applied').map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="No applications yet" 
              submessage="Apply to jobs and they'll appear here automatically"
            />
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {filteredJobs('rejected').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs('rejected').map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="No rejected jobs" 
              submessage="Jobs you mark as not interested will appear here"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
