import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUserPreferences, UserPreferences } from '@/contexts/UserPreferencesContext';

const INDUSTRIES = [
  'Investment Banking',
  'Private Equity',
  'Hedge Funds',
  'Asset Management',
  'Fintech',
  'Corporate Finance',
  'Management Consulting',
  'Technology',
  'Quantitative Finance',
  'Risk Management',
  'Trading',
  'Venture Capital',
];

const JOB_ROLES = [
  'Student',
  'Analyst',
  'Associate',
  'Portfolio Manager',
  'Trader',
  'Researcher',
  'Consultant',
  'Executive',
  'Other',
];

const GEOGRAPHIES = ['AMERICA', 'EMEA', 'ASIA', 'OTHERS'];

const EXPERIENCE_LEVELS = ['Internship', 'Entry', 'Mid', 'Senior', 'Executive'];

const CAREER_STAGES = [
  'Still in School',
  'Recent Graduate',
  'Early Career',
  'Career Switcher',
  'Experienced Professional',
];

interface UserQuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserQuiz({ open, onOpenChange }: UserQuizProps) {
  const { preferences: savedPreferences, updatePreferences, loading } = useUserPreferences();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    industry: '',
    jobRole: '',
    financialInterests: [],
    geography: '',
    experienceLevel: '',
    linkedinUrl: '',
    workExperience: '',
    education: '',
    financialGoals: '',
    dreamJob: '',
    realisticJob: '',
    worstJob: '',
    certifications: [],
    careerStage: '',
  });
  
  const [interestInput, setInterestInput] = useState('');
  const [certInput, setCertInput] = useState('');

  useEffect(() => {
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
  }, [savedPreferences]);

  const handleSave = async () => {
    await updatePreferences(preferences);
    onOpenChange(false);
    setStep(1);
  };

  const addInterest = () => {
    if (interestInput.trim() && !preferences.financialInterests.includes(interestInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        financialInterests: [...prev.financialInterests, interestInput.trim()],
      }));
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      financialInterests: prev.financialInterests.filter(i => i !== interest),
    }));
  };

  const addCertification = () => {
    if (certInput.trim() && !preferences.certifications?.includes(certInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), certInput.trim()],
      }));
      setCertInput('');
    }
  };

  const removeCertification = (cert: string) => {
    setPreferences(prev => ({
      ...prev,
      certifications: prev.certifications?.filter(c => c !== cert) || [],
    }));
  };

  const nextStep = () => setStep(prev => Math.min(totalSteps, prev + 1));
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));
  
  const progress = (step / totalSteps) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-primary mono">BASIC INFORMATION</h3>
              <p className="text-sm text-muted-foreground">Tell us about your professional background</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="careerStage" className="mono text-foreground">
                CAREER STAGE
              </Label>
              <Select
                value={preferences.careerStage}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, careerStage: value }))}
              >
                <SelectTrigger id="careerStage" className="bg-black border-2 border-primary mono">
                  <SelectValue placeholder="Select career stage" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-primary">
                  {CAREER_STAGES.map(stage => (
                    <SelectItem key={stage} value={stage} className="mono">
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experienceLevel" className="mono text-foreground">
                EXPERIENCE LEVEL
              </Label>
              <Select
                value={preferences.experienceLevel}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, experienceLevel: value }))}
              >
                <SelectTrigger id="experienceLevel" className="bg-black border-2 border-primary mono">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-primary">
                  {EXPERIENCE_LEVELS.map(level => (
                    <SelectItem key={level} value={level} className="mono">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="geography" className="mono text-foreground">
                PREFERRED GEOGRAPHY
              </Label>
              <Select
                value={preferences.geography}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, geography: value }))}
              >
                <SelectTrigger id="geography" className="bg-black border-2 border-primary mono">
                  <SelectValue placeholder="Select geography" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-primary">
                  {GEOGRAPHIES.map(geo => (
                    <SelectItem key={geo} value={geo} className="mono">
                      {geo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-primary mono">INDUSTRY & ROLE</h3>
              <p className="text-sm text-muted-foreground">Your preferences will influence recommendations</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="industry" className="mono text-foreground">
                TARGET INDUSTRY
              </Label>
              <Select
                value={preferences.industry}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger id="industry" className="bg-black border-2 border-primary mono">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-primary">
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry} value={industry} className="mono">
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobRole" className="mono text-foreground">
                TARGET ROLE
              </Label>
              <Select
                value={preferences.jobRole}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, jobRole: value }))}
              >
                <SelectTrigger id="jobRole" className="bg-black border-2 border-primary mono">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-primary">
                  {JOB_ROLES.map(role => (
                    <SelectItem key={role} value={role} className="mono">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-primary mono">BACKGROUND & EXPERIENCE</h3>
              <p className="text-sm text-muted-foreground">Share your educational and professional journey</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="education" className="mono text-foreground">
                EDUCATION
              </Label>
              <Textarea
                id="education"
                value={preferences.education}
                onChange={(e) => setPreferences(prev => ({ ...prev, education: e.target.value }))}
                placeholder="e.g., Bachelor's in Finance from Harvard, MBA from Wharton"
                className="bg-black border-2 border-primary mono text-foreground min-h-[80px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="workExperience" className="mono text-foreground">
                WORK / INTERNSHIP EXPERIENCE
              </Label>
              <Textarea
                id="workExperience"
                value={preferences.workExperience}
                onChange={(e) => setPreferences(prev => ({ ...prev, workExperience: e.target.value }))}
                placeholder="Describe your relevant work experience, internships, or projects"
                className="bg-black border-2 border-primary mono text-foreground min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linkedinUrl" className="mono text-foreground">
                LINKEDIN PROFILE (OPTIONAL)
              </Label>
              <Input
                id="linkedinUrl"
                value={preferences.linkedinUrl}
                onChange={(e) => setPreferences(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
                className="bg-black border-2 border-primary mono text-foreground"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-primary mono">SKILLS & INTERESTS</h3>
              <p className="text-sm text-muted-foreground">What are you passionate about in finance?</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="interests" className="mono text-foreground">
                FINANCIAL INTERESTS & SKILLS
              </Label>
              <div className="flex gap-2">
                <Input
                  id="interests"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  placeholder="e.g., Python, Financial Modeling, M&A"
                  className="bg-black border-2 border-primary mono text-foreground"
                />
                <Button onClick={addInterest} variant="outline" className="border-primary mono">
                  ADD
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 min-h-[60px]">
                {preferences.financialInterests.map(interest => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="bg-primary/20 text-primary border border-primary mono"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="certifications" className="mono text-foreground">
                CERTIFICATIONS (OPTIONAL)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="certifications"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  placeholder="e.g., CFA, FRM, Series 7"
                  className="bg-black border-2 border-primary mono text-foreground"
                />
                <Button onClick={addCertification} variant="outline" className="border-primary mono">
                  ADD
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.certifications?.map(cert => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="bg-primary/20 text-primary border border-primary mono"
                  >
                    {cert}
                    <button
                      onClick={() => removeCertification(cert)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-primary mono">CAREER ASPIRATIONS</h3>
              <p className="text-sm text-muted-foreground">Help us understand your career goals</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dreamJob" className="mono text-foreground">
                DREAM JOB
              </Label>
              <Input
                id="dreamJob"
                value={preferences.dreamJob}
                onChange={(e) => setPreferences(prev => ({ ...prev, dreamJob: e.target.value }))}
                placeholder="e.g., Managing Director at Goldman Sachs"
                className="bg-black border-2 border-primary mono text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="realisticJob" className="mono text-foreground">
                REALISTIC NEXT ROLE
              </Label>
              <Input
                id="realisticJob"
                value={preferences.realisticJob}
                onChange={(e) => setPreferences(prev => ({ ...prev, realisticJob: e.target.value }))}
                placeholder="e.g., Investment Banking Analyst"
                className="bg-black border-2 border-primary mono text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="worstJob" className="mono text-foreground">
                ROLES TO AVOID
              </Label>
              <Input
                id="worstJob"
                value={preferences.worstJob}
                onChange={(e) => setPreferences(prev => ({ ...prev, worstJob: e.target.value }))}
                placeholder="e.g., Back office operations"
                className="bg-black border-2 border-primary mono text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="financialGoals" className="mono text-foreground">
                FINANCIAL GOALS
              </Label>
              <Textarea
                id="financialGoals"
                value={preferences.financialGoals}
                onChange={(e) => setPreferences(prev => ({ ...prev, financialGoals: e.target.value }))}
                placeholder="What do you want to achieve financially? (e.g., break into PE, start a fund, achieve work-life balance)"
                className="bg-black border-2 border-primary mono text-foreground min-h-[100px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-black border-2 border-primary max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mono text-primary flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            PERSONAL PREFERENCES
          </DialogTitle>
          <DialogDescription className="text-foreground/70 mono">
            Step {step} of {totalSteps} - Your choices will personalize your experience
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Progress value={progress} className="h-2" />
        </div>

        <div className="py-4">
          {renderStep()}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="border-primary mono"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setStep(1);
              }}
              className="border-primary mono"
            >
              CANCEL
            </Button>
            {step < totalSteps ? (
              <Button onClick={nextStep} className="bg-primary text-black hover:bg-primary/90 mono">
                NEXT
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-primary text-black hover:bg-primary/90 mono"
              >
                {loading ? 'SAVING...' : 'SAVE PREFERENCES'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
