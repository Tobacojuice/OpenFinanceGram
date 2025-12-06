import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UseSecureAuthReturn {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

/**
 * Secure authentication hook with automatic session refresh
 */
export function useSecureAuth(): UseSecureAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
        toast({
          title: 'Session Error',
          description: 'Failed to verify authentication session',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: 'Signed Out',
            description: 'You have been signed out',
          });
        } else if (event === 'SIGNED_IN') {
          toast({
            title: 'Signed In',
            description: 'Welcome back!',
          });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'USER_UPDATED') {
          console.log('User data updated');
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign Out Failed',
        description: error instanceof Error ? error.message : 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return {
    user,
    loading,
    signOut,
  };
}
