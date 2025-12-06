import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

interface SampleJobsSeederProps {
  userId: string;
  profile: any;
}

const SAMPLE_JOBS = [
  {
    job_title: "Investment Banking Analyst",
    company: "Goldman Sachs",
    location: "New York, NY",
    job_url: "https://www.goldmansachs.com/careers",
    source: "linkedin",
    metadata: {
      salary: "$100k - $150k",
      description: "Join our M&A team working on multi-billion dollar transactions. Ideal for recent graduates with strong financial modeling skills."
    }
  },
  {
    job_title: "Private Equity Associate",
    company: "Blackstone",
    location: "London, UK",
    job_url: "https://www.blackstone.com/careers",
    source: "linkedin",
    metadata: {
      salary: "£80k - £120k",
      description: "Work on leveraged buyouts and growth equity investments across Europe. 2-3 years investment banking experience required."
    }
  },
  {
    job_title: "Quantitative Researcher",
    company: "Jane Street",
    location: "Remote",
    job_url: "https://www.janestreet.com/join-jane-street",
    source: "aiapply",
    metadata: {
      salary: "$150k - $300k",
      description: "Develop trading strategies using machine learning and statistical analysis. PhD or Masters in quantitative field preferred."
    }
  },
  {
    job_title: "Hedge Fund Analyst",
    company: "Citadel",
    location: "Chicago, IL",
    job_url: "https://www.citadel.com/careers",
    source: "linkedin",
    metadata: {
      salary: "$120k - $200k",
      description: "Join our fundamental equities team. Strong analytical skills and experience with Bloomberg/FactSet required."
    }
  },
  {
    job_title: "FinTech Product Manager",
    company: "Stripe",
    location: "San Francisco, CA",
    job_url: "https://stripe.com/jobs",
    source: "handshake",
    metadata: {
      salary: "$140k - $180k",
      description: "Lead product development for our financial services platform. Experience in payments or banking preferred."
    }
  },
  {
    job_title: "Corporate Finance Associate",
    company: "Apple",
    location: "Cupertino, CA",
    job_url: "https://www.apple.com/careers",
    source: "linkedin",
    metadata: {
      salary: "$110k - $150k",
      description: "Support FP&A and strategic initiatives for product lines. MBA or 3+ years experience in corporate finance."
    }
  },
  {
    job_title: "Risk Management Analyst",
    company: "JPMorgan Chase",
    location: "Singapore",
    job_url: "https://www.jpmorganchase.com/careers",
    source: "linkedin",
    metadata: {
      salary: "S$80k - S$120k",
      description: "Assess credit and market risk for institutional clients. CFA Level 2+ and risk modeling experience preferred."
    }
  },
  {
    job_title: "Equity Research Associate",
    company: "Morgan Stanley",
    location: "Hong Kong",
    job_url: "https://www.morganstanley.com/careers",
    source: "aiapply",
    metadata: {
      salary: "HK$600k - HK$900k",
      description: "Cover technology sector companies across Asia. Strong financial modeling and valuation skills required."
    }
  }
];

export default function SampleJobsSeeder({ userId, profile }: SampleJobsSeederProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const seedSampleJobs = async () => {
    setLoading(true);
    try {
      // Add jobs with calculated match scores
      const jobsWithScores = SAMPLE_JOBS.map(job => {
        // Simple match score based on user profile
        let matchScore = 0.5;
        
        // Boost score if job matches user branches
        if (profile.branches?.some((branch: string) => 
          job.job_title.toLowerCase().includes(branch.toLowerCase()) ||
          job.company.toLowerCase().includes(branch.toLowerCase())
        )) {
          matchScore += 0.25;
        }
        
        // Boost score if location matches geography
        if (job.location.includes(profile.geography)) {
          matchScore += 0.15;
        }
        
        // Add some randomness
        matchScore += Math.random() * 0.1;

        return {
          ...job,
          user_id: userId,
          match_score: Math.min(0.95, matchScore),
          status: 'new'
        };
      });

      const { error } = await supabase
        .from('job_alerts')
        .upsert(jobsWithScores, { 
          onConflict: 'user_id,job_url',
          ignoreDuplicates: true 
        });

      if (error) throw error;

      toast({
        title: "Sample Jobs Added!",
        description: `${SAMPLE_JOBS.length} personalized job recommendations have been added to your Targets`,
      });

      // Reload the page to show new jobs
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Error seeding jobs:', error);
      toast({
        title: "Error",
        description: "Failed to add sample jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Try It Out: Sample Jobs
        </CardTitle>
        <CardDescription>
          Don't have any job alerts yet? Add sample jobs to see how the Targets feature works
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={seedSampleJobs} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Sample Jobs...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Add {SAMPLE_JOBS.length} Sample Jobs
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          These are demo jobs from top finance companies for testing purposes
        </p>
      </CardContent>
    </Card>
  );
}
