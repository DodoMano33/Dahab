
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // التعامل مع طلبات CORS المسبقة
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('بدء عملية حذف البيانات القديمة...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('بيانات اعتماد Supabase مفقودة')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // تاريخ قبل 30 يومًا من الآن
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString()
    console.log(`حذف البيانات الأقدم من: ${cutoffDate}`)

    // حذف البيانات القديمة من جدول search_history
    const { error: searchHistoryError, count: searchHistoryCount } = await supabase
      .from('search_history')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count')

    if (searchHistoryError) {
      console.error('خطأ في حذف البيانات القديمة من search_history:', searchHistoryError)
    } else {
      console.log(`تم حذف ${searchHistoryCount} سجل من search_history`)
    }

    // حذف البيانات القديمة من جدول backtest_results
    const { error: backtestResultsError, count: backtestResultsCount } = await supabase
      .from('backtest_results')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count')

    if (backtestResultsError) {
      console.error('خطأ في حذف البيانات القديمة من backtest_results:', backtestResultsError)
    } else {
      console.log(`تم حذف ${backtestResultsCount} سجل من backtest_results`)
    }

    // حذف البيانات القديمة من جدول best_entry_point_results
    const { error: entryPointError, count: entryPointCount } = await supabase
      .from('best_entry_point_results')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count')

    if (entryPointError) {
      console.error('خطأ في حذف البيانات القديمة من best_entry_point_results:', entryPointError)
    } else {
      console.log(`تم حذف ${entryPointCount} سجل من best_entry_point_results`)
    }

    // حذف البيانات القديمة من جدول notifications
    const { error: notificationsError, count: notificationsCount } = await supabase
      .from('notifications')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count')

    if (notificationsError) {
      console.error('خطأ في حذف البيانات القديمة من notifications:', notificationsError)
    } else {
      console.log(`تم حذف ${notificationsCount} سجل من notifications`)
    }

    // حذف البيانات القديمة من جدول trading_news
    const { error: tradingNewsError, count: tradingNewsCount } = await supabase
      .from('trading_news')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count')

    if (tradingNewsError) {
      console.error('خطأ في حذف البيانات القديمة من trading_news:', tradingNewsError)
    } else {
      console.log(`تم حذف ${tradingNewsCount} سجل من trading_news`)
    }

    const totalDeleted = (searchHistoryCount || 0) + 
                        (backtestResultsCount || 0) + 
                        (entryPointCount || 0) + 
                        (notificationsCount || 0) + 
                        (tradingNewsCount || 0)

    console.log(`إجمالي السجلات المحذوفة: ${totalDeleted}`)

    return new Response(
      JSON.stringify({ 
        message: 'تم حذف البيانات القديمة بنجاح',
        statistics: {
          search_history: searchHistoryCount || 0,
          backtest_results: backtestResultsCount || 0,
          best_entry_point_results: entryPointCount || 0,
          notifications: notificationsCount || 0,
          trading_news: tradingNewsCount || 0,
          total: totalDeleted
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('خطأ في عملية حذف البيانات القديمة:', error)
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
