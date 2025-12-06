import { Card, CardContent } from "@/components/ui/card";
import { Heart, Github, Users, GraduationCap, Globe, Mail } from "lucide-react";

export const AboutTab = () => {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="p-6 border-2 border-primary bg-primary/10 text-center">
        <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="mono font-bold text-2xl text-primary mb-2">FINANCEGRAM</h3>
        <p className="mono text-lg mb-2">Open Source • Nonprofit • By Students, For Students</p>
        <p className="mono text-sm opacity-70 max-w-2xl mx-auto">
          A free platform built by finance students who got tired of gatekept resources and overpriced courses. 
          No ads. No paywalls. No BS.
        </p>
      </div>

      {/* Mission */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black border-2 border-foreground">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="mono font-bold mb-2">BY STUDENTS</h4>
            <p className="mono text-sm opacity-70">
              Built by finance students who know exactly what you need to break into the industry.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-black border-2 border-foreground">
          <CardContent className="p-6 text-center">
            <GraduationCap className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="mono font-bold mb-2">FOR STUDENTS</h4>
            <p className="mono text-sm opacity-70">
              Every feature designed around real recruiting timelines, interview prep, and career navigation.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-black border-2 border-foreground">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="mono font-bold mb-2">100% FREE</h4>
            <p className="mono text-sm opacity-70">
              No premium tiers. No hidden fees. Open source forever. Knowledge should be accessible.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Why */}
      <div className="p-6 border-2 border-foreground">
        <h4 className="mono font-bold text-lg mb-4">WHY WE BUILT THIS</h4>
        <div className="mono text-sm space-y-3 opacity-80">
          <p>• Breaking into finance shouldn't require expensive courses or insider connections</p>
          <p>• CV templates shouldn't cost $50 when banks want the exact same format anyway</p>
          <p>• Career resources shouldn't be scattered across 20 different paid platforms</p>
          <p>• Students helping students is more powerful than any recruiter pitch</p>
        </div>
      </div>

      {/* Contribute */}
      <div className="p-6 border-2 border-primary/50 bg-primary/5">
        <div className="flex items-start gap-4">
          <Github className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h4 className="mono font-bold text-lg mb-2">CONTRIBUTE</h4>
            <p className="mono text-sm opacity-80 mb-3">
              Financegram is open source. Report bugs, suggest features, or contribute code. 
              Every pull request from a student makes this platform better for everyone.
            </p>
            <a 
              href="https://github.com/financegram" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mono text-sm text-primary hover:underline"
            >
              github.com/financegram →
            </a>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="p-4 border border-foreground/30 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <span className="mono text-sm">Questions? Feedback? Want to help?</span>
        </div>
        <a href="mailto:hello@financegram.org" className="mono text-sm text-primary hover:underline">
          hello@financegram.org
        </a>
      </div>
    </div>
  );
};
