import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { detectOpenBB, getOpenBBUrl, clearDetectionCache } from "@/lib/openbb-detector";

type DetectionStatus = 'detecting' | 'found' | 'not-found' | 'redirecting';

export default function OpenBBRedirect() {
  const [status, setStatus] = useState<DetectionStatus>('detecting');
  const [port, setPort] = useState<number | undefined>();
  const [autoRedirected, setAutoRedirected] = useState(false);

  useEffect(() => {
    // Auto-detect on mount
    detectAndRedirect();
  }, []);

  const detectAndRedirect = async () => {
    setStatus('detecting');
    
    const { isInstalled, port: detectedPort } = await detectOpenBB();
    
    if (isInstalled && detectedPort) {
      setStatus('found');
      setPort(detectedPort);
      
      // Auto-redirect after brief delay to show status
      if (!autoRedirected) {
        setAutoRedirected(true);
        setTimeout(() => {
          handleOpenBB(detectedPort);
        }, 800);
      }
    } else {
      setStatus('not-found');
    }
  };

  const handleOpenBB = (detectedPort?: number) => {
    setStatus('redirecting');
    
    const targetPort = detectedPort || port;
    
    if (targetPort) {
      // Direct localhost redirect
      window.location.replace(`http://localhost:${targetPort}`);
    } else {
      // Try protocol first, fallback to website
      window.location.href = "openbb://";
      setTimeout(() => {
        window.open('https://openbb.co', '_blank');
      }, 1000);
    }
  };

  const handleRefresh = () => {
    clearDetectionCache();
    detectAndRedirect();
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'detecting':
        return { text: 'SCANNING FOR OPENBB...', icon: Loader2, color: 'text-primary' };
      case 'found':
        return { text: `OPENBB DETECTED ON PORT ${port}`, icon: CheckCircle2, color: 'text-green-500' };
      case 'not-found':
        return { text: 'OPENBB NOT DETECTED LOCALLY', icon: XCircle, color: 'text-yellow-500' };
      case 'redirecting':
        return { text: 'REDIRECTING TO OPENBB...', icon: Loader2, color: 'text-primary' };
    }
  };

  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-2xl w-full bg-black border-2 border-foreground">
        <CardHeader>
          <CardTitle className="mono text-2xl flex items-center gap-3">
            <ExternalLink className="text-primary" />
            OPENBB FINANCIAL DATA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 border-2 ${status === 'found' ? 'border-green-500 bg-green-500/10' : status === 'not-found' ? 'border-yellow-500 bg-yellow-500/10' : 'border-primary bg-primary/10'} flex items-center gap-3 mono`}>
            <StatusIcon className={`${statusInfo.color} ${status === 'detecting' || status === 'redirecting' ? 'animate-spin' : ''}`} size={20} />
            <span className={statusInfo.color}>{statusInfo.text}</span>
          </div>

          <div className="space-y-4">
            <p className="text-foreground/80 mono">
              For comprehensive financial data, analysis tools, and market insights, 
              we recommend using the OpenBB Platform.
            </p>
            
            <div className="p-4 border-2 border-primary/30 bg-primary/5">
              <h3 className="font-bold mono mb-2 text-primary">OPENBB FEATURES:</h3>
              <ul className="space-y-1 mono text-sm text-foreground/70">
                <li>&gt; Real-time market data</li>
                <li>&gt; Advanced technical analysis</li>
                <li>&gt; Fundamental analysis tools</li>
                <li>&gt; Portfolio management</li>
                <li>&gt; Economic indicators</li>
                <li>&gt; Options & derivatives analytics</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              {status === 'found' && port ? (
                <Button 
                  onClick={() => handleOpenBB()}
                  className="w-full mono text-lg py-6 border-2 bg-green-500 hover:bg-green-600"
                  size="lg"
                >
                  <CheckCircle2 className="mr-2" />
                  OPEN LOCAL OPENBB (PORT {port})
                </Button>
              ) : status === 'redirecting' ? (
                <Button 
                  className="w-full mono text-lg py-6 border-2"
                  size="lg"
                  disabled
                >
                  <Loader2 className="mr-2 animate-spin" />
                  REDIRECTING...
                </Button>
              ) : (
                <Button 
                  onClick={() => window.open('https://openbb.co', '_blank')}
                  className="w-full mono text-lg py-6 border-2"
                  size="lg"
                  disabled={status === 'detecting'}
                >
                  <ExternalLink className="mr-2" />
                  VISIT OPENBB WEBSITE
                </Button>
              )}

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="w-full mono border-2"
                size="lg"
                disabled={status === 'detecting'}
              >
                {status === 'detecting' ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    DETECTING...
                  </>
                ) : (
                  'REFRESH DETECTION'
                )}
              </Button>

              <a 
                href="https://openbb.co/products/terminal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button 
                  variant="outline"
                  className="w-full mono border-2"
                  size="lg"
                >
                  <Download className="mr-2" />
                  DOWNLOAD OPENBB TERMINAL
                </Button>
              </a>
            </div>

            <p className="text-xs text-foreground/50 mono text-center mt-4">
              {status === 'found' 
                ? `Detection cached for 5 minutes. Using port ${port}.`
                : 'Install OpenBB Terminal to access it locally. Detection is cached for faster performance.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
