import { useState, useEffect } from 'react';
import { useUniversityPlatform } from '@/hooks/use-university-platform';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';
import { UniversityPlatformDisplay } from './UniversityPlatformDisplay';

export const UniversityPlatformManager = () => {
  const { platform, isLoading, savePlatform } = useUniversityPlatform();
  const [formData, setFormData] = useState({
    university_name: '',
    platform_url: '',
  });

  useEffect(() => {
    if (platform) {
      setFormData({
        university_name: platform.university_name,
        platform_url: platform.platform_url,
      });
    }
  }, [platform]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 justify-center p-8">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p>Loading your university platform...</p>
      </div>
    );
  }

  // If platform exists and is supported, show embedded view
  if (platform?.is_supported) {
    return (
      <div className="space-y-6">
        <UniversityPlatformDisplay />

        <Card className="bg-black border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mono">
              <ExternalLink className="h-5 w-5" />
              JOB PLATFORM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              src={platform.platform_url}
              className="w-full h-[800px] border-2 border-foreground rounded"
              title="University Job Platform"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If platform exists but isn't supported, show fallback
  if (platform && !platform.is_supported) {
    return (
      <div className="space-y-6">
        <UniversityPlatformDisplay />
        <FallbackMessage universityName={platform.university_name} />
      </div>
    );
  }

  // No platform saved yet - show form
  return (
    <div className="space-y-6">
      <Card className="bg-black border-2 border-foreground">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <CardTitle className="mono">CONNECT YOUR UNIVERSITY JOB PLATFORM</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-foreground/5 border-foreground/30">
            <AlertDescription className="mono text-sm">
              Add your university's job portal to see opportunities directly here.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Input
              placeholder="University Name (e.g., University of Navarra)"
              value={formData.university_name}
              onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
              className="mono bg-black border-foreground"
            />
            <Input
              placeholder="Platform URL (e.g., https://portalempleo.unav.edu/...)"
              value={formData.platform_url}
              onChange={(e) => setFormData({ ...formData, platform_url: e.target.value })}
              className="mono bg-black border-foreground"
            />
            <Button
              onClick={() => savePlatform.mutate(formData)}
              disabled={!formData.university_name || !formData.platform_url || savePlatform.isPending}
              className="w-full mono"
            >
              {savePlatform.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Platform'
              )}
            </Button>
          </div>

          <FallbackMessage />
        </CardContent>
      </Card>
      
      {/* Display saved platform */}
      <UniversityPlatformDisplay />
    </div>
  );
};

const FallbackMessage = ({ universityName }: { universityName?: string }) => (
  <Alert className="bg-primary/10 border-primary/30">
    <AlertCircle className="h-4 w-4 text-primary" />
    <AlertDescription>
      <p className="font-semibold mb-2 mono">
        {universityName 
          ? `${universityName} platform isn't integrated yet.` 
          : "Don't see your university's platform?"}
      </p>
      <p className="text-sm mono">
        Ask your career services to contact us at{' '}
        <a 
          href="mailto:financegram@gmail.com" 
          className="underline font-medium hover:text-primary"
        >
          financegram@gmail.com
        </a>{' '}
        to enable direct integration. We'll prioritize popular universities.
      </p>
    </AlertDescription>
  </Alert>
);
