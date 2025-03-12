
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts';
import { handleOptionsRequest } from './utils/requestHandlers.ts';
import { processAnalyses } from './services/analysisProcessor.ts';
import { getLastStoredPrice } from './services/priceService.ts';
import { updateLastCheckedTime } from './services/updateService.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
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
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Missing Supabase credentials',
          timestamp: new Date().toISOString(),
          status: 'error' 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Use last stored price if needed
    if (tradingViewPrice === null || isNaN(tradingViewPrice)) {
      tradingViewPrice = await getLastStoredPrice(supabase);
    }

    // Get current time for all updates
    const currentTime = new Date().toISOString();
    
    // Get active analyses and update their last checked time
    const { analyses, count, fetchError } = await updateLastCheckedTime(supabase, currentTime, tradingViewPrice);
    
    if (fetchError) {
      console.error('Error fetching analyses:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: fetchError.message,
          details: fetchError,
          timestamp: currentTime,
          status: 'error'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!analyses || analyses.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No active analyses to check',
          timestamp: currentTime,
          checked: 0,
          symbol
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Process all analyses
    const { processedCount, errors } = await processAnalyses(supabase, analyses, tradingViewPrice, symbol);

    console.log('Automatic check completed successfully');
    
    return new Response(
      JSON.stringify({ 
        message: 'Automatic check completed successfully',
        timestamp: currentTime,
        checked: processedCount,
        totalAnalyses: analyses.length,
        tradingViewPriceUsed: tradingViewPrice !== null,
        errors: errors.length > 0 ? errors : undefined,
        symbol
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in auto-check-analyses:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        status: 'error but continuing'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
