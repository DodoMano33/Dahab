
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Setting up scheduled auto-check...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // إنشاء وظيفة قاعدة بيانات لجدولة الفحص التلقائي
    const { error: functionError } = await supabase.rpc('create_auto_check_schedule')
    
    if (functionError) {
      console.error('Error creating auto-check schedule function:', functionError)
      throw functionError
    }

    // جدولة الفحص التلقائي كل 30 ثانية بدلاً من 5 دقائق
    const { error: scheduleError } = await supabase.sql`
      SELECT cron.schedule(
        'auto-check-analyses-every-30-seconds',
        '*/30 * * * * *',  -- تشغيل كل 30 ثانية
        $$
        SELECT
          net.http_post(
            url:='${supabaseUrl}/functions/v1/auto-check-analyses',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseAnonKey}"}'::jsonb,
            body:='{}'::jsonb
          ) as request_id;
        $$
      );
    `

    if (scheduleError) {
      console.error('Error scheduling auto-check:', scheduleError)
      throw scheduleError
    }

    console.log('Scheduled auto-check every 30 seconds successfully')
    
    return new Response(
      JSON.stringify({ 
        message: 'Scheduled auto-check every 30 seconds successfully',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in schedule-auto-check:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
