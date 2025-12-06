import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft } from "lucide-react";

const FINANCE_BRANCHES = [
  "IB", "PE", "HF", "AM", "ER", "WM", "FinTech", 
  "Quant", "Risk", "CorpFin", "Real-Estate", "Crypto", "ESG"
];

const GEOGRAPHIES = [
  "United States", "United Kingdom", "Singapore", "Hong Kong",
  "Switzerland", "Germany", "France", "UAE", "Canada", "Australia"
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    branches: [] as string[],
    dreamJob: "",
    realisticJob: "",
    worstJob: "",
    geography: ""
  });
  const { toast } = useToast();

  const handleBranchToggle = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch]
    }));
  };

  const handleSubmit = async () => {
    if (formData.branches.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one finance branch",
        variant: "destructive"
      });
      return;
    }

    if (!formData.dreamJob || !formData.realisticJob || !formData.worstJob || !formData.geography) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('jobsea_profiles')
        .insert({
          user_id: user.id,
          branches: formData.branches,
          dream_job: formData.dreamJob,
          realistic_job: formData.realisticJob,
          worst_job: formData.worstJob,
          geography: formData.geography
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your JobSea profile has been created!",
      });

      onComplete();
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-4 block">
                What branch of finance do you love?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FINANCE_BRANCHES.map((branch) => (
                  <div key={branch} className="flex items-center space-x-2">
                    <Checkbox
                      id={branch}
                      checked={formData.branches.includes(branch)}
                      onCheckedChange={() => handleBranchToggle(branch)}
                    />
                    <label
                      htmlFor={branch}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {branch}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dreamJob">Dream Job Title</Label>
              <Input
                id="dreamJob"
                placeholder="e.g., Managing Director - Investment Banking"
                value={formData.dreamJob}
                onChange={(e) => setFormData(prev => ({ ...prev, dreamJob: e.target.value }))}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="realisticJob">Realistic Job Title</Label>
              <Input
                id="realisticJob"
                placeholder="e.g., Vice President - M&A"
                value={formData.realisticJob}
                onChange={(e) => setFormData(prev => ({ ...prev, realisticJob: e.target.value }))}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="worstJob">Worst-case Job Title</Label>
              <Input
                id="worstJob"
                placeholder="e.g., Associate - Corporate Finance"
                value={formData.worstJob}
                onChange={(e) => setFormData(prev => ({ ...prev, worstJob: e.target.value }))}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="geography">Geography</Label>
              <Select value={formData.geography} onValueChange={(value) => setFormData(prev => ({ ...prev, geography: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred location" />
                </SelectTrigger>
                <SelectContent>
                  {GEOGRAPHIES.map((geo) => (
                    <SelectItem key={geo} value={geo}>{geo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Welcome to JobSea™</CardTitle>
        <CardDescription>
          Complete this quick setup to get personalized job recommendations (Step {step} of 5)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1 || loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {step < 5 ? (
            <Button onClick={() => setStep(prev => prev + 1)} disabled={loading}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating Profile..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}