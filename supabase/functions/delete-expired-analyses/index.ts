
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log('Checking and deleting expired analyses...');
    
    // Call the PostgreSQL function to delete expired analyses
    const { data, error } = await supabaseAdmin.rpc('delete_expired_analyses');
    
    if (error) {
      console.error('Error calling delete_expired_analyses:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to delete expired analyses' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log('Successfully deleted expired analyses');
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        message: 'Expired analyses have been checked and deleted',
        result: data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (err) {
    console.error('Error in delete-expired-analyses function:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
