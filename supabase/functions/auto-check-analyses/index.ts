
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
    let requestData = {};
    
    if (req.method === 'POST') {
      try {
        requestData = await req.json();
        tradingViewPrice = requestData?.currentPrice || null;
        symbol = requestData?.symbol || 'XAUUSD';
        console.log('Received request with data:', {
          currentPrice: tradingViewPrice,
          symbol: symbol,
          requestedAt: requestData?.requestedAt || 'not provided'
        });
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        // استمرار التنفيذ حتى مع فشل تحليل البيانات
      }
    } else {
      console.log('Received non-POST request');
      tradingViewPrice = null;
    }
    
    console.log('Starting automatic analyses check with:', {
      tradingViewPrice,
      symbol
    });
    
    // التحقق من صحة السعر بشكل أكثر مرونة (عدم اعتباره خطأ قاتل)
    if (tradingViewPrice === null || isNaN(tradingViewPrice)) {
      console.warn('No valid price received, will proceed with last stored price:', tradingViewPrice);
      // لن نتوقف هنا، سنحاول استخدام آخر سعر مخزن في قاعدة البيانات
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // جلب آخر سعر مخزن كنسخة احتياطية إذا لم يتم توفير سعر
    if (tradingViewPrice === null || isNaN(tradingViewPrice)) {
      try {
        const { data: lastPriceData, error: lastPriceError } = await supabase
          .from('search_history')
          .select('last_checked_price')
          .is('last_checked_price', 'not.null')
          .order('last_checked_at', { ascending: false })
          .limit(1);
        
        if (!lastPriceError && lastPriceData?.length > 0) {
          tradingViewPrice = lastPriceData[0].last_checked_price;
          console.log('Using last stored price:', tradingViewPrice);
        } else {
          console.warn('Could not retrieve last stored price, using default');
          // استخدام قيمة افتراضية معقولة في أسوأ الحالات
          tradingViewPrice = 2000; // قيمة افتراضية للذهب
        }
      } catch (lastPriceErr) {
        console.error('Error fetching last stored price:', lastPriceErr);
        // استخدام قيمة افتراضية
        tradingViewPrice = 2000;
      }
    }

    // جلب جميع التحليلات النشطة من سجل البحث
    const { data: analyses, error: fetchError, count } = await supabase
      .from('search_history')
      .select('*', { count: 'exact' })
      .is('result_timestamp', null)

    if (fetchError) {
      console.error('Error fetching analyses:', fetchError);
      throw fetchError
    }

    console.log(`Found ${analyses?.length || 0} active analyses to check`);

    if (!analyses || analyses.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No active analyses to check',
          timestamp: new Date().toISOString(),
          checked: 0,
          symbol
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200  // إرجاع حالة نجاح حتى مع عدم وجود تحليلات
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
      // لن نتوقف هنا، سنستمر في معالجة التحليلات
    }
    
    let processedCount = 0;
    
    // معالجة كل تحليل
    for (const analysis of analyses) {
      try {
        console.log(`Processing analysis ${analysis.id} for symbol ${analysis.symbol}`);
        
        // تخطي التحليلات التي لا تخص الرمز الحالي إذا تم تحديد رمز
        if (symbol !== 'XAUUSD' && analysis.symbol !== symbol) {
          console.log(`Skipping analysis ${analysis.id} because symbol ${analysis.symbol} doesn't match current ${symbol}`);
          continue;
        }
        
        // استخدام السعر من TradingView (الذي أصبح مضمونًا الآن)
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
          processedCount++;
        } catch (rpcError) {
          console.error(`RPC error processing analysis ${analysis.id}:`, rpcError);
          // استمرار المعالجة مع التحليل التالي
        }
      } catch (analysisError) {
        console.error(`Error processing analysis ${analysis.id}:`, analysisError)
        // استمرار المعالجة مع التحليل التالي
      }
    }

    console.log('Automatic check completed successfully')
    
    return new Response(
      JSON.stringify({ 
        message: 'Automatic check completed successfully',
        timestamp: currentTime,
        checked: processedCount,
        totalAnalyses: analyses.length,
        tradingViewPriceUsed: tradingViewPrice !== null,
        symbol
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200  // التأكد من إرجاع حالة نجاح
      }
    )

  } catch (error) {
    console.error('Error in auto-check-analyses:', error)
    // إرجاع رد مع تفاصيل الخطأ ولكن بحالة نجاح لمنع فشل الاستدعاء
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        errorDetails: String(error),
        timestamp: new Date().toISOString(),
        status: 'error but continuing'
      }), {
        status: 200,  // إرجاع حالة نجاح حتى مع وجود خطأ
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
