
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { fetchPrice } from './priceService.ts';

const SUPPORTED_SYMBOLS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD'];

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('بدء تحديث الأسعار الحقيقية...');
    
    // التحقق من بيانات الاعتماد
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('بيانات اعتماد Supabase مفقودة');
      return new Response(
        JSON.stringify({ error: 'بيانات اعتماد Supabase مفقودة' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // إعداد عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // استخراج بيانات الطلب
    let requestData = {};
    try {
      requestData = await req.json();
    } catch (e) {
      // استخدام كائن فارغ إذا فشل تحليل JSON
      console.log('استخدام بيانات افتراضية للطلب');
    }
    
    const symbolsToUpdate = requestData.symbols || SUPPORTED_SYMBOLS;
    console.log('جاري تحديث الأسعار للرموز:', symbolsToUpdate);
    
    // جلب وتخزين الأسعار
    const updatedPrices = [];
    
    for (const symbol of symbolsToUpdate) {
      try {
        // جلب السعر الحالي
        const price = await fetchPrice(symbol);
        
        if (price !== null) {
          console.log(`تم جلب السعر للرمز ${symbol}: ${price}`);
          
          // تخزين السعر في قاعدة البيانات
          const { data, error } = await supabase
            .from('real_time_prices')
            .upsert({ 
              symbol: symbol, 
              price: price, 
              updated_at: new Date().toISOString() 
            }, { 
              onConflict: 'symbol' 
            });
          
          if (error) {
            console.error(`خطأ في تخزين السعر للرمز ${symbol}:`, error);
          } else {
            updatedPrices.push({ symbol, price });
            console.log(`تم تحديث السعر للرمز ${symbol} بنجاح`);
          }
        } else {
          console.error(`فشل في جلب السعر للرمز ${symbol}`);
        }
      } catch (error) {
        console.error(`خطأ في معالجة الرمز ${symbol}:`, error);
      }
    }
    
    return new Response(
      JSON.stringify({
        message: 'تم تحديث الأسعار الحقيقية بنجاح',
        updated_at: new Date().toISOString(),
        prices: updatedPrices
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('خطأ غير معالج في update-real-time-prices:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
