import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    if (!apiKey) {
      console.error('ALPHA_VANTAGE_API_KEY not found')
      return null
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    )
    const data = await response.json()

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      return parseFloat(data['Global Quote']['05. price'])
    }
    
    console.error('Invalid price data received:', data)
    return null
  } catch (error) {
    console.error('Error fetching price:', error)
    return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting analysis check...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // حذف التحليلات المنتهية
    const { error: deleteError } = await supabase.rpc('delete_expired_analyses')
    if (deleteError) {
      console.error('Error deleting expired analyses:', deleteError)
    }

    // جلب التحليلات النشطة التي لم يتم فحصها من قبل
    const { data: activeAnalyses, error: fetchError } = await supabase
      .from('search_history')
      .select('*')
      .is('target_hit', false)
      .is('stop_loss_hit', false)
      .is('result_timestamp', null)  // لم يتم فحصها من قبل
      .is('is_success', null)        // لم يتم تحديد نتيجتها بعد
      .not('analysis_expiry_date', 'is', null)  // لديها تاريخ انتهاء صالح

    if (fetchError) {
      throw fetchError
    }

    console.log(`Found ${activeAnalyses?.length || 0} active analyses to check`)

    if (!activeAnalyses || activeAnalyses.length === 0) {
      return new Response(JSON.stringify({ message: 'No active analyses to check' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // تجميع التحليلات حسب الرمز لتقليل عدد طلبات API
    const analysesBySymbol: { [key: string]: typeof activeAnalyses } = {}
    activeAnalyses.forEach(analysis => {
      if (!analysesBySymbol[analysis.symbol]) {
        analysesBySymbol[analysis.symbol] = []
      }
      analysesBySymbol[analysis.symbol].push(analysis)
    })

    // معالجة كل مجموعة رموز
    for (const [symbol, analyses] of Object.entries(analysesBySymbol)) {
      console.log(`Processing symbol: ${symbol}`)
      const currentPrice = await fetchPrice(symbol)

      if (currentPrice === null) {
        console.log(`Skipping ${symbol} - unable to fetch price`)
        continue
      }

      // تحديث كل تحليل لهذا الرمز
      for (const analysis of analyses) {
        console.log(`Checking analysis status for ID ${analysis.id}`)
        
        // تحديث حالة التحليل
        const { error: updateError } = await supabase.rpc('update_analysis_status', {
          p_id: analysis.id,
          p_current_price: currentPrice
        })

        if (updateError) {
          console.error(`Error updating analysis ${analysis.id}:`, updateError)
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Analysis check completed successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in check-analysis-targets:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})