import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UniversityPlatform {
  id: string;
  user_id: string;
  university_name: string;
  platform_url: string;
  is_supported: boolean;
  created_at: string;
}

export function useUniversityPlatform() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['university-platform'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: functionData, error: functionError } = await supabase.functions.invoke('university-platform', {
        method: 'GET',
      });

      if (functionError) throw functionError;
      if (!functionData.success) throw new Error(functionData.error);
      return functionData.data as UniversityPlatform | null;
    },
  });

  const savePlatform = useMutation({
    mutationFn: async (platformData: { university_name: string; platform_url: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in');

      const { data: functionData, error: functionError } = await supabase.functions.invoke('university-platform', {
        method: 'POST',
        body: platformData,
      });

      if (functionError) throw functionError;
      if (!functionData.success) throw new Error(functionData.error);
      return functionData;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['university-platform'] });
      toast({
        title: 'Success',
        description: result.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    platform: data,
    isLoading,
    error,
    savePlatform,
  };
}
