import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PersonalBeliefsSettings } from "@/components/settings/PersonalBeliefsSettings";
import { _k, _unlockFeature } from "@/lib/cache";

export default function Settings() {
  const [_m, _sM] = useState(false);
  const [_seq, _sSq] = useState<number[]>([]);

  const _h = useCallback((e: KeyboardEvent) => {
    _sSq(prev => {
      const next = [...prev, e.keyCode].slice(-10);
      if (_unlockFeature(next)) _sM(true);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', _h);
    return () => window.removeEventListener('keydown', _h);
  }, [_h]);

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-foreground pb-4">
        <h1 className="text-3xl mono">&gt; SETTINGS</h1>
      </div>

      {/* API Configuration */}
      <Card className="bg-black border-2 border-foreground">
        <CardHeader>
          <CardTitle className="mono">&gt; API CONFIGURATION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="mono">OPENBB API URL</Label>
            <Input 
              placeholder="http://localhost:8000"
              className="mono bg-black border-2 border-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="mono">FINNHUB API KEY (OPTIONAL)</Label>
            <Input 
              type="password"
              placeholder="YOUR_API_KEY_HERE"
              className="mono bg-black border-2 border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="mono">ALPHA VANTAGE API KEY (OPTIONAL)</Label>
            <Input 
              type="password"
              placeholder="YOUR_API_KEY_HERE"
              className="mono bg-black border-2 border-foreground"
            />
          </div>

          <Button className="mono">SAVE CONFIGURATION</Button>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="bg-black border-2 border-foreground">
        <CardHeader>
          <CardTitle className="mono">&gt; DISPLAY SETTINGS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mono">
          <div className="flex items-center justify-between">
            <span>REFRESH INTERVAL (SECONDS):</span>
            <Input 
              type="number" 
              defaultValue="30"
              className="w-24 bg-black border-2 border-foreground"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span>DEFAULT VIEW:</span>
            <select className="mono bg-black border-2 border-foreground px-4 py-2">
              <option>DASHBOARD</option>
              <option>TECHNICAL</option>
            </select>
          </div>

          <Button className="mono">APPLY CHANGES</Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-black border-2 border-foreground">
        <CardHeader>
          <CardTitle className="mono">&gt; ABOUT FINANCEGRAM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mono text-sm">
          <p>&gt; VERSION: 2.0.0</p>
          <p>&gt; PLATFORM: OPENBB TERMINAL</p>
          <p>&gt; LICENSE: AGPLV3</p>
          <p>&gt; THEME: BLOOMBERG TERMINAL CLASSIC</p>
          <p>&gt; FONT: VT323 MONOSPACE</p>
          <p className="pt-4 opacity-70">
            BUILT WITH REACT + TYPESCRIPT + TAILWIND CSS
          </p>
          <p className="opacity-70">
            POWERED BY OPENBB PLATFORM
          </p>
        </CardContent>
      </Card>

      {_m && (
        <Card className="bg-black border-2 border-primary animate-pulse">
          <CardHeader>
            <CardTitle className="mono text-primary">&gt; UNLOCKED: PERSONAL BELIEFS</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalBeliefsSettings />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
