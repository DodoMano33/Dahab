
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { fetchPrice } from './priceService.ts';

const SUPPORTED_SYMBOLS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD'];

// تعيين مفتاح API لحفظه
Deno.env.set('METAL_PRICE_API_KEY', '42ed2fe2e7d1d8f688ddeb027219c766');

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
    console.log('تحديث الأسعار للرموز:', symbolsToUpdate);
    
    const results = [];
    const errors = [];
    
    // جلب الأسعار لكل رمز
    for (const symbol of symbolsToUpdate) {
      try {
        console.log(`جلب السعر الحالي للرمز ${symbol}...`);
        const price = await fetchPrice(symbol);
        
        if (price !== null) {
          console.log(`تم جلب السعر للرمز ${symbol}: ${price}`);
          
          // تحديث أو إدراج السعر في قاعدة البيانات
          const { data, error } = await supabase
            .from('real_time_prices')
            .upsert({
              symbol,
              price,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'symbol'
            });
          
          if (error) {
            console.error(`خطأ في تحديث السعر للرمز ${symbol}:`, error);
            errors.push({ symbol, error: error.message });
          } else {
            console.log(`تم تحديث السعر للرمز ${symbol} بنجاح`);
            results.push({ symbol, price });
          }
        } else {
          console.error(`فشل في جلب السعر للرمز ${symbol}`);
          errors.push({ symbol, error: 'فشل في جلب السعر' });
        }
      } catch (error) {
        console.error(`خطأ غير متوقع في تحديث السعر للرمز ${symbol}:`, error);
        errors.push({ symbol, error: error.message });
      }
    }
    
    return new Response(
      JSON.stringify({
        message: 'تم تحديث الأسعار الحقيقية',
        updated_at: new Date().toISOString(),
        results,
        errors: errors.length > 0 ? errors : undefined
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
