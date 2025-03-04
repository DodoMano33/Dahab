
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

    console.log(`Processing request for symbol: ${symbol}`);

    if (!symbol) {
      console.error("Missing symbol parameter");
      return new Response(
        JSON.stringify({ error: "يجب توفير رمز العملة" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // استخدام وظيفة الحصول على السعر الموجودة
    console.log(`Fetching price for symbol: ${symbol}`);
    const price = await getCurrentPrice(symbol);
    console.log(`Price result for ${symbol}: ${price}`);

    if (price === null) {
      console.error(`Failed to get price for symbol: ${symbol}`);
      return new Response(
        JSON.stringify({ error: "تعذر الحصول على السعر" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // إرجاع السعر
    console.log(`Successfully retrieved price for ${symbol}: ${price}`);
    return new Response(
      JSON.stringify({ price }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in get-current-price function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
