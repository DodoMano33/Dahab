
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getCurrentPrice } from "../check-analysis-targets/price-fetcher.ts";

serve(async (req) => {
  // معالجة طلبات CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // استخراج معلمة الرمز من الـ URL
    const url = new URL(req.url);
    const symbol = url.searchParams.get("symbol");

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "يجب توفير رمز العملة" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // استخدام وظيفة الحصول على السعر الموجودة
    const price = await getCurrentPrice(symbol);

    if (price === null) {
      return new Response(
        JSON.stringify({ error: "تعذر الحصول على السعر" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // إرجاع السعر
    return new Response(
      JSON.stringify({ price }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
