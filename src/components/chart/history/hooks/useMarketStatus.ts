
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface MarketStatus {
  isOpen: boolean;
  serverTime?: string;
}

export const useMarketStatus = (itemId: string) => {
  const [marketStatus, setMarketStatus] = useState<MarketStatus>({ isOpen: false });
  
  useEffect(() => {
    const checkMarketStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-market-status');
        if (error) {
          console.error(`[${itemId}] Error checking market status:`, error);
          return;
        }
        setMarketStatus(data);
      } catch (err) {
        console.error(`[${itemId}] Failed to check market status:`, err);
      }
    };
    
    checkMarketStatus();
    
    const interval = setInterval(checkMarketStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [itemId]);
  
  return marketStatus;
};
