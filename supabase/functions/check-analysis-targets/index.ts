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

    console.log(`Fetching price for symbol: ${symbol}`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    )
    const data = await response.json()

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price'])
      console.log(`Received price for ${symbol}: ${price}`);
      return price
    }
    
    console.error('Invalid price data received:', data)
    return null
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error)
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
      .is('result_timestamp', null)
      .is('is_success', null)
      .not('analysis_expiry_date', 'is', null)

    if (fetchError) {
      throw fetchError
    }

    console.log(`Found ${activeAnalyses?.length || 0} active analyses to check`)

    if (!activeAnalyses || activeAnalyses.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active analyses to check' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
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
      console.log(`Processing symbol: ${symbol} with ${analyses.length} analyses`)
      const currentPrice = await fetchPrice(symbol)

      if (currentPrice === null) {
        console.log(`Skipping ${symbol} - unable to fetch price`)
        continue
      }

      console.log(`Current price for ${symbol}: ${currentPrice}`)

      // تحديث كل تحليل لهذا الرمز
      for (const analysis of analyses) {
        console.log(`\nChecking analysis ID ${analysis.id}:`)
        console.log(`Analysis type: ${analysis.analysis_type}`)
        console.log(`Direction: ${analysis.analysis.direction}`)
        console.log(`Current price: ${currentPrice}`)
        console.log(`Target price: ${analysis.analysis.targets?.[0]?.price}`)
        console.log(`Stop loss: ${analysis.analysis.stopLoss}`)
        if (analysis.analysis.bestEntryPoint) {
          console.log(`Best entry point: ${analysis.analysis.bestEntryPoint.price}`)
        }
        
        // تحديث حالة التحليل باستخدام الدالة المناسبة
        if (analysis.analysis?.bestEntryPoint?.price) {
          console.log('Using update_analysis_status_with_entry_point function')
          const { error: updateError } = await supabase.rpc('update_analysis_status_with_entry_point', {
            p_id: analysis.id,
            p_current_price: currentPrice
          })
          if (updateError) {
            console.error(`Error updating analysis with entry point ${analysis.id}:`, updateError)
          } else {
            console.log(`Successfully updated analysis ${analysis.id} with entry point`)
          }
        } else {
          console.log('Using update_analysis_status function')
          const { error: updateError } = await supabase.rpc('update_analysis_status', {
            p_id: analysis.id,
            p_current_price: currentPrice
          })
          if (updateError) {
            console.error(`Error updating analysis ${analysis.id}:`, updateError)
          } else {
            console.log(`Successfully updated analysis ${analysis.id}`)
          }
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