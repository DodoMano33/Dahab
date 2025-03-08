
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface MarketStatusData {
  isOpen: boolean;
  serverTime?: string;
}

export const useMarketStatus = (itemId?: string) => {
  const [marketStatus, setMarketStatus] = useState<MarketStatusData>({ isOpen: false });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkMarketStatus = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('check-market-status');
        if (error) {
          console.error(`${itemId ? `[${itemId}]` : ''} Error checking market status:`, error);
          return;
        }
        setMarketStatus(data);
      } catch (err) {
        console.error(`${itemId ? `[${itemId}]` : ''} Failed to check market status:`, err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkMarketStatus();
    
    // Check market status every 5 minutes
    const interval = setInterval(checkMarketStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [itemId]);

  return { marketStatus, isLoading };
};
