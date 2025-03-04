
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.27.0";

// دالة فحص تحليل بناءً على نقطة الدخول المثالية
export async function checkAnalysisWithEntryPoint(
  supabase: any,
  analysis: any, 
  currentPrice: number
): Promise<{ id: string; symbol: string; status: string } | null> {
  try {
    const direction = analysis.analysis.direction;
    const stopLoss = parseFloat(analysis.analysis.stopLoss);
    const targets = analysis.analysis.targets.map((t: any) => parseFloat(t.price));
    const firstTarget = targets[0];
    const bestEntryPrice = parseFloat(analysis.analysis.bestEntryPoint.price);
    const currentTime = new Date();
    
    console.log(`Analysis with entry point details: direction=${direction}, stopLoss=${stopLoss}, firstTarget=${firstTarget}, bestEntry=${bestEntryPrice}, current=${currentPrice}`);
    
    // التحقق من تفعيل نقطة الدخول أولاً إذا لم تكن مفعّلة
    if (!analysis.target_hit) {
      // التحقق من الوصول إلى نقطة الدخول المثالية
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
  } catch (error) {
    console.error(`Error in checkAnalysisWithEntryPoint for ${analysis.id}:`, error);
    return null;
  }
}

// دالة فحص تحليل عادي (بدون نقطة دخول)
export async function checkStandardAnalysis(
  supabase: any,
  analysis: any, 
  currentPrice: number
): Promise<{ id: string; symbol: string; status: string } | null> {
  try {
    const direction = analysis.analysis.direction;
    const stopLoss = parseFloat(analysis.analysis.stopLoss);
    const targets = analysis.analysis.targets.map((t: any) => parseFloat(t.price));
    const firstTarget = targets[0];
    const currentTime = new Date();
    
    console.log(`Standard analysis details: direction=${direction}, stopLoss=${stopLoss}, firstTarget=${firstTarget}, current=${currentPrice}`);
    
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
  } catch (error) {
    console.error(`Error in checkStandardAnalysis for ${analysis.id}:`, error);
    return null;
  }
}
