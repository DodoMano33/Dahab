
import { supabase } from "@/lib/supabase";
import { ALPHA_VANTAGE_API_KEY } from "./config";
import { priceUpdater } from "@/utils/priceUpdater";

export const getAlphaVantageKey = async (): Promise<string> => {
  // الحصول على مفتاح API المخصص من خلال خدمة تحديث السعر
  const customKey = priceUpdater.getCustomApiKey();
  if (customKey && customKey.trim() !== "") {
    console.log("استخدام مفتاح Alpha Vantage API المخصص");
    return customKey;
  }
  
  console.log("استخدام مفتاح Alpha Vantage API المكوّن مسبقاً");
  return ALPHA_VANTAGE_API_KEY;
};
