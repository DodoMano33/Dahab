
/**
 * Processes all active analyses and updates their status
 */
export async function processAnalyses(supabase: any, analyses: any[], symbol: string) {
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
      
      // طباعة المزيد من المعلومات التشخيصية
      console.log(`Analysis details: id=${analysis.id}, created_at=${analysis.created_at}, result_timestamp=${analysis.result_timestamp}, last_checked_at=${analysis.last_checked_at}`);
      
      try {
        // تحديث وقت الفحص فقط بدون الاعتماد على سعر معين
        await supabase
          .from('search_history')
          .update({
            last_checked_at: new Date().toISOString()
          })
          .eq('id', analysis.id);
        
        console.log(`Successfully updated analysis check time ${analysis.id}`);
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
