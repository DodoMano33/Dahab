
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
        // تحديث وقت آخر فحص لجميع التحليلات دفعة واحدة
        const { error: batchUpdateError } = await supabase
          .from('search_history')
          .update({ 
            last_checked_at: currentTime,
            last_checked_price: tradingViewPrice
          })
          .in('id', analyses.map((a: any) => a.id));

        if (batchUpdateError) {
          console.error('Error updating last_checked_at:', batchUpdateError);
          // لن نتوقف هنا، سنستمر في معالجة التحليلات
        } else {
          console.log('Successfully updated last_checked_at for all analyses');
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
      
    return {
      active: activeCount || 0,
      completed: (totalCount || 0) - (activeCount || 0),
      total: totalCount || 0
    };
  } catch (error) {
    console.error('Error getting analysis stats:', error);
    return { active: 0, completed: 0, total: 0 };
  }
}
