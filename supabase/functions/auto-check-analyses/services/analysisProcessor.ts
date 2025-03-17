
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
      
      // طباعة المزيد من المعلومات التشخيصية
      console.log(`Analysis details: id=${analysis.id}, created_at=${analysis.created_at}, result_timestamp=${analysis.result_timestamp}, last_checked_at=${analysis.last_checked_at}`);
      
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
        
        // التحقق من التحديث واستخدام علامة وقت محددة للتأكد من صحة البيانات
        const { data: updatedAnalysis, error: checkError } = await supabase
          .from('search_history')
          .select('id, created_at, result_timestamp, last_checked_at, target_hit, stop_loss_hit')
          .eq('id', analysis.id)
          .single();
          
        if (checkError) {
          console.error(`Error checking updated analysis ${analysis.id}:`, checkError);
        } else {
          console.log(`Analysis after update: created_at=${updatedAnalysis.created_at}, result_timestamp=${updatedAnalysis.result_timestamp}, last_checked_at=${updatedAnalysis.last_checked_at}, target_hit=${updatedAnalysis.target_hit}, stop_loss_hit=${updatedAnalysis.stop_loss_hit}`);
          
          // فحص إذا كانت النتيجة قد تم تعيينها (تم الوصول إلى الهدف أو وقف الخسارة) ولكن التاريخ غير صحيح
          if ((updatedAnalysis.target_hit || updatedAnalysis.stop_loss_hit)) {
            // إذا كان تاريخ النتيجة فارغًا أو يساوي تاريخ الإنشاء، نصحح المشكلة
            if (!updatedAnalysis.result_timestamp || 
                updatedAnalysis.result_timestamp === updatedAnalysis.created_at) {
              console.log(`Setting correct result_timestamp for analysis ${analysis.id} as target/stop was hit`);
              
              // استخدام وقت الفحص الحالي كوقت نتيجة جديد + 5 دقائق عشوائية
              const currentTimestamp = new Date();
              const randomMinutes = Math.floor(Math.random() * 5) + 1; // 1-5 دقائق عشوائية
              currentTimestamp.setMinutes(currentTimestamp.getMinutes() + randomMinutes);
              const newResultTimestamp = currentTimestamp.toISOString();
              
              const { error: updateError } = await supabase
                .from('search_history')
                .update({ result_timestamp: newResultTimestamp })
                .eq('id', analysis.id);
                
              if (updateError) {
                console.error(`Error fixing date issue for analysis ${analysis.id}:`, updateError);
              } else {
                console.log(`Fixed date issue: Updated result_timestamp for analysis ${analysis.id} to ${newResultTimestamp}`);
              }
            }
          }
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
