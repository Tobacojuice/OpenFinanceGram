import { useUniversityPlatform } from '@/hooks/use-university-platform';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, GraduationCap, CheckCircle2, Clock, ExternalLink, AlertTriangle } from 'lucide-react';

export const UniversityPlatformDisplay = () => {
  const { platform, isLoading } = useUniversityPlatform();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 justify-center p-4 border-2 border-dashed border-foreground/30">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="mono text-sm">Loading platform...</span>
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="p-4 border-2 border-dashed border-foreground/30 text-center">
        <AlertTriangle className="h-8 w-8 mx-auto text-foreground/30 mb-2" />
        <p className="mono text-sm opacity-70">No university platform connected</p>
        <p className="mono text-xs opacity-50 mt-1">Use the form above to connect your university's job portal</p>
      </div>
    );
  }

  return (
    <Card className="bg-black border-2 border-foreground">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <CardTitle className="mono text-lg">YOUR UNIVERSITY PLATFORM</CardTitle>
          </div>
          <StatusBadge isSupported={platform.is_supported} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-foreground/5 border border-foreground/20">
            <div>
              <p className="mono text-xs opacity-50">UNIVERSITY</p>
              <p className="mono font-bold">{platform.university_name}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-foreground/5 border border-foreground/20">
            <div className="flex-1 min-w-0">
              <p className="mono text-xs opacity-50">PLATFORM URL</p>
              <p className="mono text-sm truncate">{platform.platform_url}</p>
            </div>
            <a
              href={platform.platform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-2 hover:bg-primary/20 rounded transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center justify-between p-3 bg-foreground/5 border border-foreground/20">
            <div>
              <p className="mono text-xs opacity-50">STATUS</p>
              <div className="flex items-center gap-2 mt-1">
                {platform.is_supported ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="mono text-sm text-green-500">Fully Integrated</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="mono text-sm text-yellow-500">Under Review</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-foreground/5 border border-foreground/20">
            <p className="mono text-xs opacity-50">CONNECTED ON</p>
            <p className="mono text-sm">{new Date(platform.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>

        {!platform.is_supported && (
          <div className="p-3 border-2 border-yellow-500/30 bg-yellow-500/10">
            <p className="mono text-xs text-yellow-500">
              Your platform is being reviewed for direct integration. Contact us at{' '}
              <a href="mailto:financegram@gmail.com" className="underline hover:text-yellow-400">
                financegram@gmail.com
              </a>{' '}
              to expedite the process.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ isSupported }: { isSupported: boolean | null }) => {
  if (isSupported) {
    return (
      <Badge className="bg-green-500/20 text-green-500 border border-green-500/50 mono">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        SUPPORTED
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 mono">
      <Clock className="w-3 h-3 mr-1" />
      PENDING
    </Badge>
  );
};