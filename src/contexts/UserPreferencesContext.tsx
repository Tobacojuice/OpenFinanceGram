import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  industry: string;
  jobRole: string;
  financialInterests: string[];
  geography: string;
  experienceLevel: string;
  linkedinUrl?: string;
  workExperience?: string;
  education?: string;
  financialGoals?: string;
  dreamJob?: string;
  realisticJob?: string;
  worstJob?: string;
  certifications?: string[];
  careerStage?: string;
}

interface UserPreferencesContextType {
  preferences: UserPreferences | null;
  updatePreferences: (prefs: UserPreferences) => Promise<void>;
  loading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('jobsea_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setPreferences({
          industry: profile.branches?.[0] || '',
          jobRole: profile.experience_level || '',
          financialInterests: profile.skills || [],
          geography: profile.geography || '',
          experienceLevel: profile.experience_level || '',
          linkedinUrl: profile.linkedin_url || '',
          workExperience: profile.work_experience || '',
          education: profile.education || '',
          financialGoals: profile.financial_goals || '',
          dreamJob: profile.dream_job || '',
          realisticJob: profile.realistic_job || '',
          worstJob: profile.worst_job || '',
          certifications: profile.certifications || [],
          careerStage: profile.career_stage || '',
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (prefs: UserPreferences) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('jobsea_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('jobsea_profiles')
          .update({
            geography: prefs.geography,
            experience_level: prefs.experienceLevel,
            branches: [prefs.industry],
            skills: prefs.financialInterests,
            linkedin_url: prefs.linkedinUrl,
            work_experience: prefs.workExperience,
            education: prefs.education,
            financial_goals: prefs.financialGoals,
            dream_job: prefs.dreamJob,
            realistic_job: prefs.realisticJob,
            worst_job: prefs.worstJob,
            certifications: prefs.certifications,
            career_stage: prefs.careerStage,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile with required fields
        const { error } = await supabase
          .from('jobsea_profiles')
          .insert({
            user_id: user.id,
            geography: prefs.geography,
            experience_level: prefs.experienceLevel,
            branches: [prefs.industry],
            skills: prefs.financialInterests,
            linkedin_url: prefs.linkedinUrl,
            work_experience: prefs.workExperience,
            education: prefs.education,
            financial_goals: prefs.financialGoals,
            dream_job: prefs.dreamJob || 'To be determined',
            realistic_job: prefs.realisticJob || 'To be determined',
            worst_job: prefs.worstJob || 'To be determined',
            certifications: prefs.certifications,
            career_stage: prefs.careerStage,
          });

        if (error) throw error;
      }

      setPreferences(prefs);
      toast({
        title: 'Preferences saved',
        description: 'Your preferences have been updated successfully',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      });
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
