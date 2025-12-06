import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award, TrendingUp, Calendar, DollarSign, Clock, ExternalLink } from "lucide-react";

interface CertificatesTrackerProps {
  userId: string;
}

const CERTIFICATES = [
  {
    id: "CFA",
    name: "CFA (Chartered Financial Analyst)",
    roi: 25,
    cost: 4000,
    hours: 900,
    passRate: 44,
    expiryYears: null,
    sponsorshipRate: 65,
    url: "https://www.cfainstitute.org"
  },
  {
    id: "FRM",
    name: "FRM (Financial Risk Manager)",
    roi: 20,
    cost: 1350,
    hours: 400,
    passRate: 46,
    expiryYears: null,
    sponsorshipRate: 55,
    url: "https://www.garp.org/frm"
  },
  {
    id: "CAIA",
    name: "CAIA (Chartered Alternative Investment Analyst)",
    roi: 18,
    cost: 3300,
    hours: 400,
    passRate: 60,
    expiryYears: null,
    sponsorshipRate: 45,
    url: "https://caia.org"
  },
  {
    id: "CQF",
    name: "CQF (Certificate in Quantitative Finance)",
    roi: 22,
    cost: 18000,
    hours: 350,
    passRate: 85,
    expiryYears: null,
    sponsorshipRate: 40,
    url: "https://www.cqf.com"
  },
  {
    id: "Series7",
    name: "Series 7 (General Securities Representative)",
    roi: 15,
    cost: 305,
    hours: 150,
    passRate: 68,
    expiryYears: null,
    sponsorshipRate: 90,
    url: "https://www.finra.org"
  },
  {
    id: "CFP",
    name: "CFP (Certified Financial Planner)",
    roi: 17,
    cost: 6000,
    hours: 250,
    passRate: 67,
    expiryYears: 2,
    sponsorshipRate: 50,
    url: "https://www.cfp.net"
  }
];

export default function CertificatesTracker({ userId }: CertificatesTrackerProps) {
  const [userCerts, setUserCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserCertificates();
  }, []);

  const fetchUserCertificates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobsea_cert_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setUserCerts(data || []);
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (certificateId: string, newStatus: string) => {
    try {
      const existingCert = userCerts.find(c => c.certificate === certificateId);

      if (existingCert) {
        const { error } = await supabase
          .from('jobsea_cert_progress')
          .update({ status: newStatus })
          .eq('id', existingCert.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jobsea_cert_progress')
          .insert({
            user_id: userId,
            certificate: certificateId,
            status: newStatus
          });

        if (error) throw error;
      }

      await fetchUserCertificates();
      toast({
        title: "Status Updated",
        description: `Certificate status updated to: ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating certificate:', error);
      toast({
        title: "Error",
        description: "Failed to update certificate status",
        variant: "destructive"
      });
    }
  };

  const getCertProgress = (certId: string) => {
    const userCert = userCerts.find(c => c.certificate === certId);
    if (!userCert) return { status: "not_started", progress: 0 };

    const statusMap: { [key: string]: number } = {
      not_started: 0,
      enrolled: 50,
      passed: 100
    };

    return {
      status: userCert.status,
      progress: statusMap[userCert.status] || 0
    };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading certificates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certificates Recommender
        </CardTitle>
        <CardDescription>
          Track your professional certifications and their ROI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert) => {
            const { status, progress } = getCertProgress(cert.id);

            return (
              <Card key={cert.id} className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{cert.name}</h4>
                        </div>
                        <Badge variant={status === "passed" ? "default" : status === "enrolled" ? "secondary" : "outline"}>
                          {status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">ROI</p>
                          <p className="font-semibold">+{cert.roi}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Cost</p>
                          <p className="font-semibold">${cert.cost.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Hours</p>
                          <p className="font-semibold">{cert.hours}h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Pass Rate</p>
                          <p className="font-semibold">{cert.passRate}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {cert.sponsorshipRate}% employer sponsorship rate
                      {cert.expiryYears && ` • Renew every ${cert.expiryYears} years`}
                    </div>

                    <div className="flex gap-2">
                      <Select value={status} onValueChange={(value) => handleUpdateStatus(cert.id, value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="enrolled">Enrolled</SelectItem>
                          <SelectItem value="passed">Passed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(cert.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}