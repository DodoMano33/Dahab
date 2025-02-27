
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.27.0";

// دالة للحصول على السعر الحالي لرمز معين
async function getCurrentPrice(symbol: string): Promise<number | null> {
  try {
    console.log(`Getting current price for ${symbol}`);

    // تعديل الرمز لتناسب واجهة Alpha Vantage
    const apiSymbol = symbol.replace("XAUUSD", "GOLD");
    
    // استخدام واجهة برمجة مجانية للحصول على السعر
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${apiSymbol}&apikey=${Deno.env.get("ALPHA_VANTAGE_API_KEY")}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
      const price = parseFloat(data["Global Quote"]["05. price"]);
      console.log(`Current price for ${symbol}: ${price}`);
      return price;
    }
    
    // إذا فشل Alpha Vantage، حاول مصدرًا آخر (Finnhub)
    const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${apiSymbol}&token=${Deno.env.get("FINNHUB_API_KEY")}`;
    const finnhubResponse = await fetch(finnhubUrl);
    const finnhubData = await finnhubResponse.json();
    
    if (finnhubData && finnhubData.c) {
      console.log(`Fallback price for ${symbol} from Finnhub: ${finnhubData.c}`);
      return finnhubData.c;
    }
    
    console.log(`Failed to get price for ${symbol}`);
    return null;
  } catch (error) {
    console.error(`Error getting price for ${symbol}:`, error);
    return null;
  }
}

// معالج الطلب الرئيسي
Deno.serve(async (req) => {
  try {
    // تهيئة عميل Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting analysis check");
    
    // جلب جميع التحليلات النشطة
    const { data: activeAnalyses, error } = await supabase
      .from("search_history")
      .select("id, symbol, current_price, analysis, analysis_type, timeframe, target_hit")
      .is("result_timestamp", null);

    if (error) {
      console.error("Error fetching active analyses:", error);
      throw error;
    }

    console.log(`Found ${activeAnalyses.length} active analyses to check`);
    
    if (activeAnalyses.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No active analyses to check" 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // جمع الرموز الفريدة للحصول على الأسعار
    const uniqueSymbols = [...new Set(activeAnalyses.map(a => a.symbol))];
    console.log(`Unique symbols to check: ${uniqueSymbols.join(", ")}`);
    
    // الحصول على الأسعار الحالية للرموز
    const pricePromises = uniqueSymbols.map(async (symbol) => {
      const price = await getCurrentPrice(symbol);
      return { symbol, price };
    });
    
    const prices = await Promise.all(pricePromises);
    const priceMap = new Map(prices.filter(p => p.price !== null).map(p => [p.symbol, p.price]));
    
    console.log(`Retrieved prices for ${priceMap.size} symbols`);
    
    // تحديث حالة كل تحليل
    const updatePromises = activeAnalyses.map(async (analysis) => {
      const currentPrice = priceMap.get(analysis.symbol);
      
      if (!currentPrice) {
        console.log(`No price available for ${analysis.symbol}, skipping analysis ${analysis.id}`);
        return null;
      }
      
      try {
        console.log(`Checking analysis ${analysis.id} for ${analysis.symbol}: entry price=${analysis.current_price}, current=${currentPrice}`);
        
        // التحقق من وجود bestEntryPoint
        const hasBestEntryPoint = analysis.analysis && 
                                 analysis.analysis.bestEntryPoint && 
                                 analysis.analysis.bestEntryPoint.price;
        
        if (hasBestEntryPoint) {
          // إذا كان لديه نقطة دخول مثالية، استخدم وظيفة التحقق المخصصة
          const { data, error: rpcError } = await supabase.rpc(
            "update_analysis_status_with_entry_point",
            { 
              p_id: analysis.id, 
              p_current_price: currentPrice 
            }
          );
          
          if (rpcError) {
            console.error(`Error updating entry point analysis ${analysis.id}:`, rpcError);
          } else {
            console.log(`Successfully updated entry point analysis ${analysis.id}`);
          }
        } else {
          // إذا لم يكن لديه نقطة دخول مثالية، استخدم وظيفة التحقق العادية
          const { data, error: rpcError } = await supabase.rpc(
            "update_analysis_status",
            { 
              p_id: analysis.id, 
              p_current_price: currentPrice 
            }
          );
          
          if (rpcError) {
            console.error(`Error updating analysis ${analysis.id}:`, rpcError);
          } else {
            console.log(`Successfully updated analysis ${analysis.id}`);
          }
        }
        
        return analysis.id;
      } catch (updateError) {
        console.error(`Error processing analysis ${analysis.id}:`, updateError);
        return null;
      }
    });
    
    const results = await Promise.all(updatePromises);
    const successfulUpdates = results.filter(Boolean).length;
    
    console.log(`Completed checking ${activeAnalyses.length} analyses, ${successfulUpdates} were updated`);
    
    return new Response(JSON.stringify({ 
      message: `Checked ${activeAnalyses.length} analyses, updated ${successfulUpdates}`,
      updated: successfulUpdates
    }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error in check-analysis-targets:", error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
