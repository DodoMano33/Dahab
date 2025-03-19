
/**
 * Processes all active analyses and updates their status
 */
export async function processAnalyses(supabase: any, analyses: any[], currentPrice: number | null, symbol: string) {
  let processedCount = 0;
  let errors: { analysis_id: string; error: string }[] = [];
  
  // معالجة كل تحليل
  for (const analysis of analyses) {
    try {
      console.log(`Processing analysis ${analysis.id} for symbol ${analysis.symbol}`);
      
      // تخطي التحليلات التي لا تخص الرمز الحالي إذا تم تحديد رمز
      if (symbol !== 'XAUUSD' && analysis.symbol !== symbol) {
        console.log(`Skipping analysis ${analysis.id} because symbol ${analysis.symbol} doesn't match current ${symbol}`);
        continue;
      }
      
      // استخدام السعر من TradingView (الذي أصبح مضمونًا الآن)
      console.log(`Checking analysis ${analysis.id} with price:`, currentPrice);
      
      // تحقق من وجود نقطة دخول مثالية
      const hasBestEntryPoint = analysis.analysis?.bestEntryPoint?.price;
      
      try {
        // تحديث حالة التحليل مع نقطة الدخول المثالية
        if (hasBestEntryPoint) {
          console.log(`Analysis ${analysis.id} has best entry point, using update_analysis_status_with_entry_point`);
          await supabase.rpc('update_analysis_status_with_entry_point', {
            p_id: analysis.id,
            p_current_price: currentPrice
          });
        } else {
          // تحديث حالة التحليل العادي
          console.log(`Analysis ${analysis.id} has NO best entry point, using update_analysis_status`);
          await supabase.rpc('update_analysis_status', {
            p_id: analysis.id,
            p_current_price: currentPrice
          });
        }
        console.log(`Successfully processed analysis ${analysis.id}`);
        processedCount++;
      } catch (rpcError) {
        errors.push({
          analysis_id: analysis.id,
          error: rpcError instanceof Error ? rpcError.message : String(rpcError)
        });
        console.error(`RPC error processing analysis ${analysis.id}:`, rpcError);
      }
    } catch (analysisError) {
      errors.push({
        analysis_id: analysis.id,
        error: analysisError instanceof Error ? analysisError.message : String(analysisError)
      });
      console.error(`Error processing analysis ${analysis.id}:`, analysisError);
    }
  }
  
  return { processedCount, errors };
}
