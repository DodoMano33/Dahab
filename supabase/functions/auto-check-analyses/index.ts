
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
    console.log('Starting automatic analyses check...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // جلب جميع التحليلات النشطة من سجل البحث
    const { data: analyses, error } = await supabase
      .from('search_history')
      .select('*')
      .is('result_timestamp', null)

    if (error) {
      throw error
    }

    console.log(`Found ${analyses.length} active analyses to check`)

    if (analyses.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active analyses to check' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // تحديد الوقت الحالي - نفس الوقت سيتم استخدامه لكل التحديثات
    const currentTime = new Date().toISOString()
    console.log("Setting last_checked_at to:", currentTime)

    // تحديث وقت آخر فحص لجميع التحليلات دفعة واحدة
    const { error: batchUpdateError } = await supabase
      .from('search_history')
      .update({ last_checked_at: currentTime })
      .in('id', analyses.map(a => a.id))

    if (batchUpdateError) {
      console.error('Error updating last_checked_at:', batchUpdateError)
      throw batchUpdateError
    }
    
    // معالجة كل تحليل
    for (const analysis of analyses) {
      try {
        // تحقق من وجود نقطة دخول مثالية
        const hasBestEntryPoint = analysis.analysis.bestEntryPoint?.price
        const currentPrice = analysis.last_checked_price || analysis.current_price
        
        // تحديث حالة التحليل مع نقطة الدخول المثالية
        if (hasBestEntryPoint) {
          await supabase.rpc('update_analysis_status_with_entry_point', {
            p_id: analysis.id,
            p_current_price: currentPrice
          })
        } else {
          // تحديث حالة التحليل العادي
          await supabase.rpc('update_analysis_status', {
            p_id: analysis.id,
            p_current_price: currentPrice
          })
        }
      } catch (analysisError) {
        console.error(`Error processing analysis ${analysis.id}:`, analysisError)
      }
    }

    console.log('Automatic check completed successfully')
    
    return new Response(
      JSON.stringify({ 
        message: 'Automatic check completed successfully',
        timestamp: currentTime,
        checked: analyses.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in auto-check-analyses:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
