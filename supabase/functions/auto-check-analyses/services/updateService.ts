
/**
 * Updates the last checked time for all analyses and returns active analyses
 */
export async function updateLastCheckedTime(supabase: any, currentTime: string, tradingViewPrice: number | null) {
  try {
    console.log('Starting updateLastCheckedTime with price:', tradingViewPrice);
    
    // جلب جميع التحليلات النشطة من سجل البحث
    const { data: analyses, error: fetchError, count } = await supabase
      .from('search_history')
      .select('*', { count: 'exact' })
      .is('result_timestamp', null);

    if (fetchError) {
      console.error('Error fetching active analyses:', fetchError);
      return { analyses: null, count: 0, fetchError };
    }

    console.log(`Found ${analyses?.length || 0} active analyses to check`);

    if (analyses && analyses.length > 0) {
      try {
        // طباعة نماذج من حالات التحليلات للتشخيص
        if (analyses.length > 0) {
          const firstAnalysis = analyses[0];
          console.log('Sample analysis entry:', {
            id: firstAnalysis.id,
            created_at: firstAnalysis.created_at,
            result_timestamp: firstAnalysis.result_timestamp,
            last_checked_at: firstAnalysis.last_checked_at,
            symbol: firstAnalysis.symbol,
            current_price: firstAnalysis.current_price,
            last_checked_price: firstAnalysis.last_checked_price
          });
          
          // التحقق من وجود حقل result_timestamp في هذا التحليل
          if (firstAnalysis.result_timestamp !== null) {
            console.warn(`WARNING: Analysis ${firstAnalysis.id} has a non-null result_timestamp but was returned in the query for active analyses`);
          }
        }
        
        // تحديث وقت آخر فحص لجميع التحليلات دفعة واحدة
        // استخدم only_update_if_null=false لتحديث last_checked_at دائمًا
        const { error: batchUpdateError } = await supabase
          .from('search_history')
          .update({ 
            last_checked_at: currentTime,
            last_checked_price: tradingViewPrice
          })
          .in('id', analyses.map((a: any) => a.id))
          .is('result_timestamp', null); // تأكد من تحديث التحليلات النشطة فقط

        if (batchUpdateError) {
          console.error('Error updating last_checked_at:', batchUpdateError);
          // لن نتوقف هنا، سنستمر في معالجة التحليلات
        } else {
          console.log('Successfully updated last_checked_at for active analyses');
          
          // التحقق من التحديث
          const { data: updated, error: checkError } = await supabase
            .from('search_history')
            .select('id, created_at, result_timestamp, last_checked_at, last_checked_price')
            .in('id', analyses.slice(0, 2).map((a: any) => a.id)); // نتحقق من أول تحليلين فقط
            
          if (!checkError && updated && updated.length > 0) {
            updated.forEach(analysis => {
              console.log(`Updated analysis: id=${analysis.id}, created_at=${analysis.created_at}, result_timestamp=${analysis.result_timestamp}, last_checked_at=${analysis.last_checked_at}, last_checked_price=${analysis.last_checked_price}`);
              
              // التحقق من صحة القيم بعد التحديث
              if (analysis.result_timestamp !== null) {
                console.warn(`WARNING: Analysis ${analysis.id} has a non-null result_timestamp after update`);
              }
            });
          }
        }
      } catch (updateError) {
        console.error('Exception in batch update operation:', updateError);
      }
    } else {
      console.log('No active analyses found to update');
    }

    return { analyses, count: analyses?.length || 0, fetchError: null };
  } catch (error) {
    console.error('Uncaught exception in updateLastCheckedTime:', error);
    return { analyses: null, count: 0, fetchError: error };
  }
}

/**
 * Gets analysis statistics for reporting
 */
export async function getAnalysisStats(supabase: any): Promise<{ active: number, completed: number, total: number }> {
  try {
    const { count: totalCount } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true });
      
    const { count: activeCount } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true })
      .is('result_timestamp', null);
      
    const stats = {
      active: activeCount || 0,
      completed: (totalCount || 0) - (activeCount || 0),
      total: totalCount || 0
    };
    
    console.log('Analysis stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting analysis stats:', error);
    return { active: 0, completed: 0, total: 0 };
  }
}
