import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of supported platforms (can be expanded)
const SUPPORTED_PLATFORMS = [
  'handshake.com',
  'symplicity.com',
  '12twenty.com',
  'ucr.edu',
  'unav.edu',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Authorization header missing' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET request - fetch user's platform
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('user_university_platforms')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST request - save platform
    if (req.method === 'POST') {
      const { university_name, platform_url } = await req.json();

      // Validate URL
      try {
        const url = new URL(platform_url);
        const isSupported = SUPPORTED_PLATFORMS.some(domain => url.hostname.includes(domain));
        
        console.log(`Platform URL: ${platform_url}, Supported: ${isSupported}`);

        const { data, error } = await supabase
          .from('user_university_platforms')
          .upsert({
            user_id: user.id,
            university_name,
            platform_url,
            is_supported: isSupported,
          }, {
            onConflict: 'user_id',
          })
          .select()
          .single();

        if (error) {
          console.error('Upsert error:', error);
          throw error;
        }

        return new Response(
          JSON.stringify({
            success: true,
            data,
            message: isSupported
              ? 'Platform added successfully!'
              : 'Platform saved. We\'ll review it for integration.',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (urlError) {
        console.error('URL validation error:', urlError);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid URL format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
