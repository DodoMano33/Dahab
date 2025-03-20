
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { fetchPrice } from './priceService.ts';

// نستخدم فقط XAUUSD لسعر الذهب من CFI
const SUPPORTED_SYMBOLS = ['XAUUSD'];

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('بدء تحديث سعر الذهب في الوقت الحقيقي...');
    
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
    
    // جلب وتخزين سعر الذهب فقط
    try {
      // جلب السعر الحالي للذهب
      const price = await fetchPrice('XAUUSD');
      
      if (price !== null) {
        console.log(`تم جلب سعر الذهب: ${price}`);
        
        // تخزين السعر في قاعدة البيانات
        const { data, error } = await supabase
          .from('real_time_prices')
          .upsert({ 
            symbol: 'XAUUSD', 
            price: price, 
            updated_at: new Date().toISOString() 
          }, { 
            onConflict: 'symbol' 
          });
        
        if (error) {
          console.error(`خطأ في تخزين سعر الذهب:`, error);
          return new Response(
            JSON.stringify({ error: 'خطأ في تخزين سعر الذهب' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          console.log(`تم تحديث سعر الذهب بنجاح`);
          return new Response(
            JSON.stringify({
              message: 'تم تحديث سعر الذهب بنجاح',
              updated_at: new Date().toISOString(),
              price: price
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        console.error(`فشل في جلب سعر الذهب`);
        return new Response(
          JSON.stringify({ error: 'فشل في جلب سعر الذهب' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error(`خطأ في معالجة سعر الذهب:`, error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('خطأ غير معالج في update-real-time-prices:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
