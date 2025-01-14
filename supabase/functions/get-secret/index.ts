import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get secret name from request
    const { secretName } = await req.json()
    
    if (!secretName) {
      throw new Error('Secret name is required')
    }

    console.log(`Fetching secret: ${secretName}`)

    // Get the secret value using the service role key and maybeSingle() instead of single()
    const { data, error } = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('name', secretName)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    if (!data) {
      console.error(`Secret "${secretName}" not found`)
      throw new Error(`Secret "${secretName}" not found`)
    }

    return new Response(
      JSON.stringify({ secret: data.value }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})