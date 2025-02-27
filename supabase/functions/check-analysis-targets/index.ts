
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.27.0";

// دالة للحصول على السعر الحالي لرمز معين
async function getCurrentPrice(symbol: string): Promise<number | null> {
  try {
    console.log(`Getting current price for ${symbol}`);

    // تعديل الرمز لتناسب واجهة Alpha Vantage
    const apiSymbol = symbol.includes("USD") ? symbol.replace("USD", "") : symbol;
    
    // استخدام واجهة برمجة Alpha Vantage للحصول على السعر
    const ALPHA_VANTAGE_API_KEY = "74DI7LHBTQPLCOGR";
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${apiSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
      const price = parseFloat(data["Global Quote"]["05. price"]);
      console.log(`Current price for ${symbol}: ${price}`);
      return price;
    }
    
    // في حالة الفشل، نحاول استخدام واجهة برمجة بديلة
    console.log(`Failed to get price for ${symbol} via Alpha Vantage, trying alternative API`);
    
    if (symbol === "XAUUSD" || symbol === "GOLD") {
      // استخدام API مخصص لأسعار الذهب
      const goldUrl = "https://api.metals.live/v1/spot/gold";
      const goldResponse = await fetch(goldUrl);
      const goldData = await goldResponse.json();
      
      if (goldData && goldData.length > 0 && goldData[0].price) {
        console.log(`Gold price from alternative API: ${goldData[0].price}`);
        return goldData[0].price;
      }
    }
    
    // محاولة أخرى للأسهم
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${apiSymbol}`;
    const yahooResponse = await fetch(yahooUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const yahooData = await yahooResponse.json();
    
    if (yahooData && yahooData.quoteResponse && yahooData.quoteResponse.result && 
        yahooData.quoteResponse.result.length > 0 && yahooData.quoteResponse.result[0].regularMarketPrice) {
      const price = yahooData.quoteResponse.result[0].regularMarketPrice;
      console.log(`Price from Yahoo Finance: ${price}`);
      return price;
    }
    
    console.log(`Failed to get price for ${symbol} from all sources`);
    return null;
  } catch (error) {
    console.error(`Error getting price for ${symbol}:`, error);
    return null;
  }
}

// معالج الطلب الرئيسي
Deno.serve(async (req) => {
  // إعداد CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // التعامل مع طلبات OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
        message: "No active analyses to check",
        checked: 0,
        updated: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
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
            return null;
          } else {
            console.log(`Successfully updated entry point analysis ${analysis.id}`);
            return analysis.id;
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
            return null;
          } else {
            console.log(`Successfully updated analysis ${analysis.id}`);
            return analysis.id;
          }
        }
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
      checked: activeAnalyses.length,
      updated: successfulUpdates
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error in check-analysis-targets:", error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
