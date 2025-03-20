
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('إعداد جدولة حذف البيانات القديمة...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('بيانات اعتماد Supabase مفقودة')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // إنشاء وظيفة قاعدة بيانات لجدولة حذف البيانات القديمة
    const { error: functionError } = await supabase.rpc('create_data_cleanup_schedule')
    
    if (functionError) {
      console.error('خطأ في إنشاء وظيفة جدولة حذف البيانات القديمة:', functionError)
      throw functionError
    }

    // جدولة حذف البيانات القديمة لتعمل مرة واحدة يوميًا عند الساعة 3 صباحًا
    const { error: scheduleError } = await supabase.sql`
      SELECT cron.schedule(
        'clean-old-data-daily',
        '0 3 * * *',  -- الساعة 3 صباحًا كل يوم
        $$
        SELECT
          net.http_post(
            url:='${supabaseUrl}/functions/v1/clean-old-data',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseAnonKey}"}'::jsonb,
            body:='{}'::jsonb
          ) as request_id;
        $$
      );
    `

    if (scheduleError) {
      console.error('خطأ في جدولة حذف البيانات القديمة:', scheduleError)
      throw scheduleError
    }

    console.log('تمت جدولة حذف البيانات القديمة بنجاح للعمل مرة واحدة يوميًا الساعة 3 صباحًا')
    
    return new Response(
      JSON.stringify({ 
        message: 'تمت جدولة حذف البيانات القديمة بنجاح للعمل مرة واحدة يوميًا الساعة 3 صباحًا',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('خطأ في schedule-data-cleanup:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
