
/**
 * Updates the last checked time for all analyses and returns active analyses
 */
export async function updateLastCheckedTime(supabase: any, currentTime: string, tradingViewPrice: number | null) {
  try {
    // جلب جميع التحليلات النشطة من سجل البحث
    const { data: analyses, error: fetchError, count } = await supabase
      .from('search_history')
      .select('*', { count: 'exact' })
      .is('result_timestamp', null);

    if (fetchError) {
      return { analyses: null, count: 0, fetchError };
    }

    console.log(`Found ${analyses?.length || 0} active analyses to check`);

    if (analyses && analyses.length > 0) {
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
      }
    }

    return { analyses, count, fetchError: null };
  } catch (error) {
    console.error('Error in updateLastCheckedTime:', error);
    return { analyses: null, count: 0, fetchError: error };
  }
}
