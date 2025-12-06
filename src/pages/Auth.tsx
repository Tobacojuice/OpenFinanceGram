import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from "lucide-react";
import { validateEmail, validatePassword } from "@/lib/validation";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      toast({
        title: "Invalid password",
        description: passwordValidation.message,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome to Financegram Terminal",
      });

      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      toast({
        title: "Invalid password",
        description: passwordValidation.message,
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
      
      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-black border-2 border-primary">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Terminal size={48} className="text-primary" />
          </div>
          <CardTitle className="text-3xl mono text-primary">&gt; FINANCEGRAM</CardTitle>
          <p className="mono text-sm opacity-70 mt-2">OPENBB TERMINAL • PROFESSIONAL TRADING PLATFORM</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="w-full bg-black border-2 border-foreground">
              <TabsTrigger value="signin" className="flex-1 mono">SIGN IN</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 mono">SIGN UP</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="mono text-xs">EMAIL</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mono"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="mono text-xs">PASSWORD</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mono"
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mono"
                >
                  {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="mono text-xs">EMAIL</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mono"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="mono text-xs">PASSWORD</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mono"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="mono text-xs">CONFIRM PASSWORD</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mono"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mono"
                >
                  {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </Button>

                <p className="text-xs mono text-center opacity-70">
                  By signing up, you agree to our Terms of Service
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 border-2 border-foreground mono text-xs">
            <p className="text-primary mb-2">&gt; SYSTEM STATUS:</p>
            <p className="opacity-70">• Real-time market data</p>
            <p className="opacity-70">• Advanced charting tools</p>
            <p className="opacity-70">• Paper trading platform</p>
            <p className="opacity-70">• TJR-style AI strategy</p>
            <p className="opacity-70">• Portfolio management</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}