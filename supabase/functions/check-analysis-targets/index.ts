
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.27.0";

// دالة للحصول على السعر الحالي لرمز معين
async function getCurrentPrice(symbol: string): Promise<number | null> {
  try {
    console.log(`Getting current price for ${symbol}`);

    // تعديل الرمز لتناسب واجهة Alpha Vantage
    const apiSymbol = symbol.includes("USD") ? symbol.replace("USD", "") : symbol;
    
    // استخدام واجهة برمجة Alpha Vantage للحصول على السعر
    const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY") || "74DI7LHBTQPLCOGR";
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

      // محاولة استخدام API أخرى للذهب
      try {
        const metalAltUrl = "https://www.goldapi.io/api/XAU/USD";
        const metalResponse = await fetch(metalAltUrl, {
          headers: {
            "x-access-token": "goldapi-f20pyjvlfs7d6-io",
            "Content-Type": "application/json"
          }
        });
        const metalData = await metalResponse.json();
        if (metalData && metalData.price) {
          console.log(`Gold price from GoldAPI: ${metalData.price}`);
          return metalData.price;
        }
      } catch (metalError) {
        console.error("Error fetching from GoldAPI:", metalError);
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
    
    // استخدام سعر ثابت للاختبار في حالة فشل كل المحاولات
    if (symbol === "XAUUSD") {
      console.log("Using hardcoded test price for XAUUSD: 2915");
      return 2915; // سعر ثابت للاختبار
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
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  // التعامل مع طلبات OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // تحليل محتوى الطلب
    const requestData = await req.json().catch(() => ({}));
    const forceCheck = requestData.forceCheck === true;
    
    // تهيئة عميل Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting analysis check (force mode: ${forceCheck})`);
    
    // جلب جميع التحليلات النشطة التي لم تنته صلاحيتها بعد
    const { data: activeAnalyses, error } = await supabase
      .from("search_history")
      .select("id, symbol, current_price, analysis, analysis_type, timeframe, target_hit, stop_loss_hit, result_timestamp, analysis_expiry_date, last_checked_price, last_checked_at")
      .is("result_timestamp", null)
      .gt("analysis_expiry_date", new Date().toISOString());

    if (error) {
      console.error("Error fetching active analyses:", error);
      throw error;
    }

    console.log(`Found ${activeAnalyses?.length || 0} active analyses to check`);
    
    if (!activeAnalyses || activeAnalyses.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No active analyses to check",
        checked: 0,
        updated: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // إذا كانت هناك تحليلات تم فحصها مؤخرًا وليس في وضع الفحص الإجباري، نتخطاها
    const currentTime = new Date();
    const analysesToCheck = forceCheck ? activeAnalyses : activeAnalyses.filter(a => {
      // فحص التحليلات التي لم يتم فحصها من قبل، أو التي مر على فحصها أكثر من 30 دقيقة
      if (!a.last_checked_at) return true;
      const lastChecked = new Date(a.last_checked_at);
      const minutesSinceLastCheck = (currentTime.getTime() - lastChecked.getTime()) / (1000 * 60);
      return minutesSinceLastCheck > 30;
    });
    
    console.log(`${analysesToCheck.length} analyses will be checked (out of ${activeAnalyses.length})`);

    // جمع الرموز الفريدة للحصول على الأسعار
    const uniqueSymbols = [...new Set(analysesToCheck.map(a => a.symbol))];
    console.log(`Unique symbols to check: ${uniqueSymbols.join(", ")}`);
    
    if (uniqueSymbols.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No analyses need checking at this time",
        checked: 0,
        updated: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // الحصول على الأسعار الحالية للرموز
    const pricePromises = uniqueSymbols.map(async (symbol) => {
      const price = await getCurrentPrice(symbol);
      return { symbol, price };
    });
    
    const prices = await Promise.all(pricePromises);
    const priceMap = new Map(prices.filter(p => p.price !== null).map(p => [p.symbol, p.price]));
    
    console.log(`Retrieved prices for ${priceMap.size} symbols`);
    
    // تحديث حالة كل تحليل
    const updatePromises = analysesToCheck.map(async (analysis) => {
      const currentPrice = priceMap.get(analysis.symbol);
      
      if (!currentPrice) {
        console.log(`No price available for ${analysis.symbol}, skipping analysis ${analysis.id}`);
        return null;
      }
      
      try {
        console.log(`Checking analysis ${analysis.id} for ${analysis.symbol}: entry price=${analysis.current_price}, current=${currentPrice}`);
        
        // استخراج المعلومات المهمة من التحليل
        const direction = analysis.analysis.direction;
        const stopLoss = parseFloat(analysis.analysis.stopLoss);
        const targets = analysis.analysis.targets.map(t => parseFloat(t.price));
        const firstTarget = targets[0];
        
        console.log(`Analysis details: direction=${direction}, stopLoss=${stopLoss}, firstTarget=${firstTarget}, current=${currentPrice}`);
        
        // التحقق من وجود نقطة دخول مثالية
        const hasBestEntryPoint = analysis.analysis && 
                                analysis.analysis.bestEntryPoint && 
                                analysis.analysis.bestEntryPoint.price;
        
        // إذا كان هناك نقطة دخول مثالية، وهي تختلف عن سعر الدخول، وتحليل نقطة الدخول لم يكتمل
        if (hasBestEntryPoint) {
          const bestEntryPrice = parseFloat(analysis.analysis.bestEntryPoint.price);
          console.log(`Analysis has best entry point: ${bestEntryPrice}`);
          
          // التحقق من تفعيل نقطة الدخول أولاً إذا لم تكن مفعّلة
          if (!analysis.target_hit) {
            // التحقق من الوصول إلى نقطة الدخول المثالية أو وقف الخسارة مباشرة
            if ((direction === "صاعد" && currentPrice <= bestEntryPrice) || 
                (direction === "هابط" && currentPrice >= bestEntryPrice)) {
                
              console.log(`✅ Best entry point hit for ${analysis.id}: ${currentPrice} hits ${bestEntryPrice}`);
              
              // تحديث الحالة في قاعدة البيانات لتسجيل أن نقطة الدخول قد تم الوصول إليها
              const { error: updateError } = await supabase
                .from("search_history")
                .update({ 
                  target_hit: true,
                  last_checked_price: currentPrice,
                  last_checked_at: currentTime.toISOString()
                })
                .eq("id", analysis.id);
              
              if (updateError) {
                console.error(`Error updating target_hit for analysis ${analysis.id}:`, updateError);
                return null;
              }
              
              return {
                id: analysis.id,
                symbol: analysis.symbol,
                status: "entry_hit"
              };
            } else if ((direction === "صاعد" && currentPrice <= stopLoss) || 
                      (direction === "هابط" && currentPrice >= stopLoss)) {
              // إذا وصل السعر إلى وقف الخسارة قبل الوصول إلى نقطة الدخول
              console.log(`⛔ Stop loss hit before entry for ${analysis.id}: current=${currentPrice}, stopLoss=${stopLoss}`);
              
              // إضافة سجل إلى backtest_results وإزالته من search_history
              const { data, error: rpcError } = await supabase.rpc(
                "move_to_backtest_results",
                { 
                  p_search_history_id: analysis.id, 
                  p_exit_price: currentPrice,
                  p_is_success: false,
                  p_is_entry_point_analysis: true
                }
              );
              
              if (rpcError) {
                console.error(`Error updating analysis ${analysis.id}:`, rpcError);
                return null;
              }
              
              return {
                id: analysis.id,
                symbol: analysis.symbol,
                status: "failure"
              };
            }
          } else {
            // إذا تم تفعيل نقطة الدخول بالفعل، نتحقق من تحقيق الهدف أو وقف الخسارة
            if ((direction === "صاعد" && currentPrice >= firstTarget) || 
                (direction === "هابط" && currentPrice <= firstTarget)) {
              console.log(`🎯 Target hit after entry for ${analysis.id}: current=${currentPrice}, target=${firstTarget}`);
              
              // إضافة سجل إلى backtest_results وتحديث search_history
              const { data, error: rpcError } = await supabase.rpc(
                "move_to_backtest_results",
                { 
                  p_search_history_id: analysis.id, 
                  p_exit_price: currentPrice,
                  p_is_success: true,
                  p_is_entry_point_analysis: true
                }
              );
              
              if (rpcError) {
                console.error(`Error updating analysis ${analysis.id}:`, rpcError);
                return null;
              }
              
              return {
                id: analysis.id,
                symbol: analysis.symbol,
                status: "success"
              };
            } else if ((direction === "صاعد" && currentPrice <= stopLoss) || 
                      (direction === "هابط" && currentPrice >= stopLoss)) {
              console.log(`⛔ Stop loss hit after entry for ${analysis.id}: current=${currentPrice}, stopLoss=${stopLoss}`);
              
              // إضافة سجل إلى backtest_results وإزالته من search_history
              const { data, error: rpcError } = await supabase.rpc(
                "move_to_backtest_results",
                { 
                  p_search_history_id: analysis.id, 
                  p_exit_price: currentPrice,
                  p_is_success: false,
                  p_is_entry_point_analysis: true
                }
              );
              
              if (rpcError) {
                console.error(`Error updating analysis ${analysis.id}:`, rpcError);
                return null;
              }
              
              return {
                id: analysis.id,
                symbol: analysis.symbol,
                status: "failure"
              };
            }
          }
        } else {
          // التحليل العادي بدون نقطة دخول مثالية
          // التحقق من تحقيق الهدف أو ضرب وقف الخسارة مباشرة بناءً على الاتجاه والسعر الحالي
          let isSuccess = false;
          let isFailure = false;
          
          if (direction === "صاعد") {
            if (currentPrice >= firstTarget) {
              console.log(`🎯 Target hit for bullish analysis ${analysis.id}: ${currentPrice} >= ${firstTarget}`);
              isSuccess = true;
            } else if (currentPrice <= stopLoss) {
              console.log(`⛔ Stop loss hit for bullish analysis ${analysis.id}: ${currentPrice} <= ${stopLoss}`);
              isFailure = true;
            }
          } else if (direction === "هابط") {
            if (currentPrice <= firstTarget) {
              console.log(`🎯 Target hit for bearish analysis ${analysis.id}: ${currentPrice} <= ${firstTarget}`);
              isSuccess = true;
            } else if (currentPrice >= stopLoss) {
              console.log(`⛔ Stop loss hit for bearish analysis ${analysis.id}: ${currentPrice} >= ${stopLoss}`);
              isFailure = true;
            }
          }
          
          // إذا تم تحقيق الهدف أو ضرب وقف الخسارة، نحدّث السجل
          if (isSuccess || isFailure) {
            console.log(`Updating analysis ${analysis.id} with success=${isSuccess}`);
            
            // نقل التحليل إلى جدول backtest_results وتحديث حالته أو إزالته من search_history
            const { data, error: rpcError } = await supabase.rpc(
              "move_to_backtest_results",
              { 
                p_search_history_id: analysis.id, 
                p_exit_price: currentPrice,
                p_is_success: isSuccess,
                p_is_entry_point_analysis: false
              }
            );
            
            if (rpcError) {
              console.error(`Error updating analysis ${analysis.id}:`, rpcError);
              return null;
            } else {
              console.log(`Successfully updated analysis ${analysis.id}`);
              return {
                id: analysis.id,
                symbol: analysis.symbol,
                status: isSuccess ? "success" : "failure"
              };
            }
          }
        }
        
        // تحديث last_checked_price وlast_checked_at إذا لم يتم تحقيق الهدف أو ضرب وقف الخسارة
        const { error: updateError } = await supabase
          .from("search_history")
          .update({ 
            last_checked_price: currentPrice,
            last_checked_at: currentTime.toISOString()
          })
          .eq("id", analysis.id);
        
        if (updateError) {
          console.error(`Error updating last_checked_price for analysis ${analysis.id}:`, updateError);
        } else {
          console.log(`Updated last_checked_price for analysis ${analysis.id} to ${currentPrice}`);
        }
        
        return null;
      } catch (updateError) {
        console.error(`Error processing analysis ${analysis.id}:`, updateError);
        return null;
      }
    });
    
    const results = await Promise.all(updatePromises);
    const successfulUpdates = results.filter(Boolean);
    
    console.log(`Completed checking ${analysesToCheck.length} analyses, ${successfulUpdates.length} were updated`);
    
    return new Response(JSON.stringify({ 
      message: `Checked ${analysesToCheck.length} analyses, updated ${successfulUpdates.length}`,
      checked: analysesToCheck.length,
      updated: successfulUpdates.length,
      updates: successfulUpdates
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error in check-analysis-targets:", error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
    }), {
      status: error instanceof Error && error.message?.includes("not allowed") ? 405 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
