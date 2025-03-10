
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.27.0";
import { corsHeaders } from "../_shared/cors.ts";
import { getCurrentPrice } from "./price-fetcher.ts";
import { checkAnalysisWithEntryPoint, checkStandardAnalysis } from "./analysis-checker.ts";

// دالة لتحديد التحليلات التي تحتاج للفحص
function getAnalysesToCheck(activeAnalyses: any[], forceCheck: boolean): any[] {
  if (forceCheck) return activeAnalyses;
  
  const currentTime = new Date();
  return activeAnalyses.filter(a => {
    // فحص التحليلات التي لم يتم فحصها من قبل، أو التي مر على فحصها أكثر من 30 دقيقة
    if (!a.last_checked_at) return true;
    const lastChecked = new Date(a.last_checked_at);
    const minutesSinceLastCheck = (currentTime.getTime() - lastChecked.getTime()) / (1000 * 60);
    return minutesSinceLastCheck > 30;
  });
}

// دالة لجمع الرموز الفريدة وتحديد أسعارها
async function getPricesForSymbols(symbols: string[]): Promise<Map<string, number>> {
  console.log(`Unique symbols to check: ${symbols.join(", ")}`);
  
  const pricePromises = symbols.map(async (symbol) => {
    const price = await getCurrentPrice(symbol);
    return { symbol, price };
  });
  
  const prices = await Promise.all(pricePromises);
  return new Map(prices.filter(p => p.price !== null).map(p => [p.symbol, p.price]));
}

// دالة لمعالجة كل تحليل
async function processAnalysis(
  supabase: any, 
  analysis: any, 
  currentPrice: number
): Promise<{ id: string; symbol: string; status: string } | null> {
  try {
    console.log(`Checking analysis ${analysis.id} for ${analysis.symbol}: entry price=${analysis.current_price}, current=${currentPrice}`);
    
    // التحقق من وجود نقطة دخول مثالية
    const hasBestEntryPoint = analysis.analysis && 
                              analysis.analysis.bestEntryPoint && 
                              analysis.analysis.bestEntryPoint.price;
    
    if (hasBestEntryPoint) {
      return await checkAnalysisWithEntryPoint(supabase, analysis, currentPrice);
    } else {
      return await checkStandardAnalysis(supabase, analysis, currentPrice);
    }
  } catch (error) {
    console.error(`Error processing analysis ${analysis.id}:`, error);
    return null;
  }
}

// معالج الطلب الرئيسي
Deno.serve(async (req) => {
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

    // تحديد التحليلات التي تحتاج للفحص
    const analysesToCheck = getAnalysesToCheck(activeAnalyses, forceCheck);
    console.log(`${analysesToCheck.length} analyses will be checked (out of ${activeAnalyses.length})`);

    // جمع الرموز الفريدة للحصول على الأسعار
    const uniqueSymbols = [...new Set(analysesToCheck.map(a => a.symbol))];
    
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
    const priceMap = await getPricesForSymbols(uniqueSymbols);
    console.log(`Retrieved prices for ${priceMap.size} symbols`);
    
    // تحديث حالة كل تحليل
    const updatePromises = analysesToCheck.map(async (analysis) => {
      const currentPrice = priceMap.get(analysis.symbol);
      
      if (!currentPrice) {
        console.log(`No price available for ${analysis.symbol}, skipping analysis ${analysis.id}`);
        return null;
      }
      
      return await processAnalysis(supabase, analysis, currentPrice);
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
