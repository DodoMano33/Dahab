
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // استخراج السعر المرسل من الطلب (من TradingView)
    let tradingViewPrice: number | null = null;
    let symbol: string = 'XAUUSD'; // القيمة الافتراضية
    
    if (req.method === 'POST') {
      const body = await req.json();
      tradingViewPrice = body.currentPrice || null;
      symbol = body.symbol || 'XAUUSD';
      console.log('Received request with data:', {
        currentPrice: tradingViewPrice,
        symbol: symbol
      });
    } else {
      console.log('Received non-POST request');
      tradingViewPrice = null;
    }
    
    console.log('Starting automatic analyses check with:', {
      tradingViewPrice,
      symbol
    });
    
    // التحقق من صحة السعر
    if (tradingViewPrice === null || isNaN(tradingViewPrice)) {
      console.error('Invalid price received:', tradingViewPrice);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid price provided', 
          receivedPrice: tradingViewPrice 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // جلب جميع التحليلات النشطة من سجل البحث
    const { data: analyses, error } = await supabase
      .from('search_history')
      .select('*')
      .is('result_timestamp', null)

    if (error) {
      console.error('Error fetching analyses:', error);
      throw error
    }

    console.log(`Found ${analyses.length} active analyses to check`);

    if (analyses.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No active analyses to check',
          timestamp: new Date().toISOString(),
          checked: 0,
          symbol
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // تحديد الوقت الحالي - نفس الوقت سيتم استخدامه لكل التحديثات
    const currentTime = new Date().toISOString()
    console.log("Setting last_checked_at to:", currentTime);

    // تحديث وقت آخر فحص لجميع التحليلات دفعة واحدة
    const { error: batchUpdateError } = await supabase
      .from('search_history')
      .update({ 
        last_checked_at: currentTime,
        last_checked_price: tradingViewPrice
      })
      .in('id', analyses.map(a => a.id))

    if (batchUpdateError) {
      console.error('Error updating last_checked_at:', batchUpdateError)
      throw batchUpdateError
    }
    
    // معالجة كل تحليل
    for (const analysis of analyses) {
      try {
        console.log(`Processing analysis ${analysis.id} for symbol ${analysis.symbol}`);
        
        // تخطي التحليلات التي لا تخص الرمز الحالي إذا تم تحديد رمز
        if (symbol !== 'XAUUSD' && analysis.symbol !== symbol) {
          console.log(`Skipping analysis ${analysis.id} because symbol ${analysis.symbol} doesn't match current ${symbol}`);
          continue;
        }
        
        // استخدام السعر من TradingView
        const currentPrice = tradingViewPrice;
          
        console.log(`Checking analysis ${analysis.id} with price:`, currentPrice);
        
        // تحقق من وجود نقطة دخول مثالية
        const hasBestEntryPoint = analysis.analysis?.bestEntryPoint?.price;
        
        try {
          // تحديث حالة التحليل مع نقطة الدخول المثالية
          if (hasBestEntryPoint) {
            console.log(`Analysis ${analysis.id} has best entry point, using update_analysis_status_with_entry_point`);
            await supabase.rpc('update_analysis_status_with_entry_point', {
              p_id: analysis.id,
              p_current_price: currentPrice
            });
          } else {
            // تحديث حالة التحليل العادي
            console.log(`Analysis ${analysis.id} has NO best entry point, using update_analysis_status`);
            await supabase.rpc('update_analysis_status', {
              p_id: analysis.id,
              p_current_price: currentPrice
            });
          }
          console.log(`Successfully processed analysis ${analysis.id}`);
        } catch (rpcError) {
          console.error(`RPC error processing analysis ${analysis.id}:`, rpcError);
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
        checked: analyses.length,
        tradingViewPriceUsed: tradingViewPrice !== null,
        symbol
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
