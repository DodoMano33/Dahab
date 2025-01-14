import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get request body
    const { secretName } = await req.json()
    console.log('Fetching secret:', secretName)

    if (!secretName) {
      throw new Error('Secret name is required')
    }

    // Query the secrets table
    const { data: secret, error } = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('name', secretName)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    if (!secret) {
      console.log('No secret found for name:', secretName)
      return new Response(
        JSON.stringify({ error: 'Secret not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Secret retrieved successfully')
    return new Response(
      JSON.stringify({ secret: secret.value }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in get-secret function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})