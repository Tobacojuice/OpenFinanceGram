import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Save, TrendingUp, Plus, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CVRenderer } from "./CVRenderer";
import { templates } from "@/lib/cv-templates";
import { validateIBCV, calculateATSScore, CVData } from "@/lib/cv-validator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CVBuilderProps {
  userId: string;
}

export default function CVBuilder({ userId }: CVBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates['goldman-ib']);
  const [cvData, setCvData] = useState<CVData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    interests: []
  });
  const [atsScore, setAtsScore] = useState<number>(0);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedCVs, setSavedCVs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedCVs();
    loadProfileData();
  }, []);

  useEffect(() => {
    // Recalculate ATS score and validate when data changes
    const score = calculateATSScore(cvData);
    setAtsScore(score);
    
    const warnings = validateIBCV(cvData, selectedTemplate.id);
    setValidationWarnings(warnings);
  }, [cvData, selectedTemplate]);

  const loadProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('jobsea_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (profile && !cvData.fullName) {
        setCvData(prev => ({
          ...prev,
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          linkedin: profile.linkedin_url || '',
          summary: `Finance professional specializing in ${profile.branches?.join(', ')}. Target role: ${profile.realistic_job}. Based in ${profile.geography}.`,
          skills: profile.skills || [],
          certifications: profile.certifications || []
        }));

        toast({
          title: "Profile Loaded",
          description: "CV pre-filled with your JobSea profile data",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const fetchSavedCVs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobsea_cvs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedCVs(data || []);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const score = calculateATSScore(cvData);
      
      const { error } = await supabase
        .from('jobsea_cvs')
        .insert({
          user_id: userId,
          template: selectedTemplate.id,
          payload: cvData as any,
          ats_score: score
        });

      if (error) throw error;

      await fetchSavedCVs();

      toast({
        title: "CV Saved",
        description: `Your CV has been saved with an ATS score of ${score}%`,
      });
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast({
        title: "Error",
        description: "Failed to save CV",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        title: '',
        location: '',
        dates: '',
        bullets: ['']
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addBullet = (expIndex: number) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      )
    }));
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          bullets: exp.bullets.map((b, j) => j === bulletIndex ? value : b)
        } : exp
      )
    }));
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          bullets: exp.bullets.filter((_, j) => j !== bulletIndex)
        } : exp
      )
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        degree: '',
        gpa: '',
        location: '',
        dates: '',
        honors: []
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !cvData.skills.includes(skill)) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (index: number) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Side - CV Builder Form */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  IB-Standard CV Builder
                </CardTitle>
                <CardDescription>
                  Build your CV with precise templates. Live validation for Wall Street standards.
                </CardDescription>
              </div>
              <Badge 
                variant={atsScore >= 85 ? "default" : atsScore >= 70 ? "secondary" : "destructive"} 
                className="text-lg px-4 py-2"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {atsScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Selector */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Select Template</Label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(templates).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-3 border-2 rounded-lg hover:border-primary transition-colors text-left ${
                      selectedTemplate.id === template.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {template.pageLimit} page{template.pageLimit > 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.fontFamily.includes('Crimson') ? 'Times New Roman' : 'Inter'}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Warnings */}
            {validationWarnings.length > 0 && (
              <Alert variant={validationWarnings.some(w => w.includes('❌')) ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1 text-sm">
                    {validationWarnings.slice(0, 5).map((warning, i) => (
                      <div key={i}>{warning}</div>
                    ))}
                    {validationWarnings.length > 5 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        +{validationWarnings.length - 5} more warnings
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={cvData.fullName}
                      onChange={(e) => setCvData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cvData.email}
                      onChange={(e) => setCvData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john.doe@university.edu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={cvData.phone}
                      onChange={(e) => setCvData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={cvData.linkedin}
                      onChange={(e) => setCvData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                </div>
                {!selectedTemplate.id.includes('-ib') && (
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={cvData.summary}
                      onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Results-driven finance professional..."
                      rows={3}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-4">
                {cvData.experience.map((exp, expIndex) => (
                  <Card key={expIndex}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between items-start">
                        <Label className="text-sm font-semibold">Experience #{expIndex + 1}</Label>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeExperience(expIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Company Name *"
                        value={exp.company}
                        onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                      />
                      <Input
                        placeholder="Job Title *"
                        value={exp.title}
                        onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
                        />
                        <Input
                          placeholder="Jun 2023 - Aug 2023"
                          value={exp.dates}
                          onChange={(e) => updateExperience(expIndex, 'dates', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Bullet Points</Label>
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex gap-2">
                            <Textarea
                              placeholder="• Led 3 M&A transactions worth $1.2B..."
                              value={bullet}
                              onChange={(e) => updateBullet(expIndex, bulletIndex, e.target.value)}
                              rows={2}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBullet(expIndex, bulletIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addBullet(expIndex)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Bullet
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={addExperience} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-4">
                {cvData.education.map((edu, eduIndex) => (
                  <Card key={eduIndex}>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between items-start">
                        <Label className="text-sm font-semibold">Education #{eduIndex + 1}</Label>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeEducation(eduIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="University Name *"
                        value={edu.school}
                        onChange={(e) => updateEducation(eduIndex, 'school', e.target.value)}
                      />
                      <Input
                        placeholder="Degree (e.g., B.A. in Economics, Magna Cum Laude)"
                        value={edu.degree}
                        onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="GPA: 3.8/4.0"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(eduIndex, 'gpa', e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={edu.location}
                          onChange={(e) => updateEducation(eduIndex, 'location', e.target.value)}
                        />
                      </div>
                      <Input
                        placeholder="Dates (e.g., Aug 2020 - May 2024)"
                        value={edu.dates}
                        onChange={(e) => updateEducation(eduIndex, 'dates', e.target.value)}
                      />
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={addEducation} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 mt-4">
                <div>
                  <Label>Add Skills</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Financial Modeling, Python, Excel"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addSkill(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addSkill(input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Press Enter or click + to add</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button onClick={() => removeSkill(index)} className="ml-1 hover:text-destructive">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSave} disabled={loading} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save CV"}
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Print PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Live Preview */}
      <div className="lg:col-span-3 lg:sticky lg:top-6 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Live Preview - {selectedTemplate.name}</span>
              {validationWarnings.length === 0 && cvData.fullName && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Valid
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              CV updates in real-time • {selectedTemplate.pageLimit} page limit • {selectedTemplate.fontFamily.includes('Crimson') ? 'Times New Roman 10pt' : 'Inter 11pt'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CVRenderer template={selectedTemplate} data={cvData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
