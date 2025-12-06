import { useState, useEffect } from "react";
import { Clock, User, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserQuiz from "@/components/auth/UserQuiz";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been logged out successfully",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="h-16 bg-black border-b-2 border-primary px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-xl mono text-primary font-bold">&gt; FINANCEGRAM TERMINAL</h1>
      </div>

      <div className="flex items-center gap-6 mono text-sm">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <span className="text-primary">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              hour12: false 
            })}
          </span>
          <span className="opacity-70">CET</span>
        </div>
        
        <div className="text-xs opacity-70">
          <span className="text-primary">LIVE</span> • REAL-TIME DATA
        </div>

        {userEmail && (
          <Button
            variant="outline"
            size="sm"
            className="border-primary mono"
            onClick={() => setQuizOpen(true)}
          >
            <ClipboardList size={16} className="mr-2" />
            PREFERENCES
          </Button>
        )}

        {userEmail ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-primary mono">
                <User size={16} className="mr-2" />
                {userEmail.split('@')[0].toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-2 border-primary">
              <DropdownMenuLabel className="mono text-primary">ACCOUNT</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/30" />
              <DropdownMenuItem className="mono text-foreground/80">{userEmail}</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/30" />
              <DropdownMenuItem onClick={handleSignOut} className="mono text-foreground hover:text-primary cursor-pointer">
                <LogOut size={16} className="mr-2" />
                SIGN OUT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-primary mono"
            onClick={() => navigate("/auth")}
          >
            <User size={16} className="mr-2" />
            LOGIN
          </Button>
        )}
      </div>
      
      <UserQuiz open={quizOpen} onOpenChange={setQuizOpen} />
    </header>
  );
}
