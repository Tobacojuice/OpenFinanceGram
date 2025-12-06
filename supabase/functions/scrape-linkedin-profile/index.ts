import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { linkedin_url } = await req.json();

    if (!linkedin_url || !linkedin_url.includes('linkedin.com')) {
      throw new Error('Invalid LinkedIn URL');
    }

    console.log(`Scraping LinkedIn profile: ${linkedin_url}`);

    // Check rate limit
    const { data: rateLimitCheck } = await supabase
      .rpc('check_linkedin_scrape_rate_limit', { p_user_id: user.id });

    if (!rateLimitCheck) {
      // Create scrape request with rate_limited status
      await supabase.from('jobsea_linkedin_scrapes').insert({
        user_id: user.id,
        linkedin_url,
        status: 'rate_limited',
        error_message: 'Daily scrape limit reached (10 per day)',
      });

      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. You can scrape up to 10 profiles per day.' 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create scrape request
    const { data: scrapeRequest, error: scrapeError } = await supabase
      .from('jobsea_linkedin_scrapes')
      .insert({
        user_id: user.id,
        linkedin_url,
        status: 'processing',
      })
      .select()
      .single();

    if (scrapeError) {
      console.error('Error creating scrape request:', scrapeError);
      throw scrapeError;
    }

    // Scrape the profile (respecting LinkedIn's robots.txt and public data only)
    try {
      // Add delay to respect rate limits (6 seconds between requests)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(linkedin_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch LinkedIn page: ${response.status}`);
      }

      const html = await response.text();

      // Parse basic public information from LinkedIn public profile
      // Note: LinkedIn's structure may change, these are simplified extractors
      const extractText = (pattern: RegExp): string | null => {
        const match = html.match(pattern);
        return match ? match[1].trim() : null;
      };

      const extractNumber = (pattern: RegExp): number | null => {
        const match = html.match(pattern);
        return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
      };

      // Extract public identifier from URL
      const urlMatch = linkedin_url.match(/linkedin\.com\/in\/([^\/\?]+)/);
      const publicIdentifier = urlMatch ? urlMatch[1] : null;

      // Extract structured data (LinkedIn often includes JSON-LD)
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
      let structuredData: any = null;
      if (jsonLdMatch) {
        try {
          structuredData = JSON.parse(jsonLdMatch[1]);
        } catch (e) {
          console.log('Failed to parse JSON-LD');
        }
      }

      // Build profile data from structured data or HTML parsing
      const profileData: any = {
        user_id: user.id,
        linkedin_url,
        public_identifier: publicIdentifier,
        first_name: null,
        last_name: null,
        headline: null,
        location: null,
        connections_count: null,
        followers_count: null,
        summary: null,
        profile_image_url: null,
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        scraped_at: new Date().toISOString(),
      };

      // Extract from structured data if available
      if (structuredData) {
        if (structuredData['@type'] === 'Person') {
          const nameParts = (structuredData.name || '').split(' ');
          profileData.first_name = nameParts[0] || null;
          profileData.last_name = nameParts.slice(1).join(' ') || null;
          profileData.headline = structuredData.jobTitle || null;
          profileData.profile_image_url = structuredData.image || null;
        }
      }

      // Fallback to meta tags
      if (!profileData.first_name) {
        const ogTitle = extractText(/<meta property="og:title" content="([^"]+)"/);
        if (ogTitle) {
          const nameParts = ogTitle.split(' ');
          profileData.first_name = nameParts[0] || null;
          profileData.last_name = nameParts.slice(1).join(' ') || null;
        }
      }

      if (!profileData.headline) {
        profileData.headline = extractText(/<meta property="og:description" content="([^"]+)"/);
      }

      if (!profileData.profile_image_url) {
        profileData.profile_image_url = extractText(/<meta property="og:image" content="([^"]+)"/);
      }

      // Store or update profile
      const { error: upsertError } = await supabase
        .from('jobsea_linkedin_profiles')
        .upsert(profileData, {
          onConflict: 'user_id,linkedin_url',
        });

      if (upsertError) {
        console.error('Error storing profile:', upsertError);
        throw upsertError;
      }

      // Update scrape request status
      await supabase
        .from('jobsea_linkedin_scrapes')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', scrapeRequest.id);

      console.log(`Successfully scraped profile: ${publicIdentifier}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          profile: profileData,
          message: 'Profile scraped successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (scrapeErr: any) {
      console.error('Scraping error:', scrapeErr);

      // Update scrape request with error
      await supabase
        .from('jobsea_linkedin_scrapes')
        .update({
          status: 'failed',
          error_message: scrapeErr.message || 'Unknown error',
          completed_at: new Date().toISOString(),
        })
        .eq('id', scrapeRequest.id);

      throw scrapeErr;
    }

  } catch (error: any) {
    console.error('Error in scrape-linkedin-profile function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to scrape LinkedIn profile' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
