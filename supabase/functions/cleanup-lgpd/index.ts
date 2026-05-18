// Supabase Edge Function: cleanup-lgpd
// Triggered on schedule to close overdue LGPD requests and purge expired LGPD data.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const cleanupSecret = Deno.env.get('LGPD_CLEANUP_SECRET');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req: Request) => {
  if (cleanupSecret) {
    const authHeader = req.headers.get('Authorization');

    if (authHeader !== `Bearer ${cleanupSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const { data, error } = await supabase.rpc('cleanup_lgpd_retention');

    if (error) {
      console.error('LGPD cleanup error:', error);
      return new Response(
        JSON.stringify({ success: false, error: String(error) }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, result: data }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('LGPD cleanup function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
