
/**
 * Utility for checking market status (open/closed)
 */

import { supabase } from "@/lib/supabase";

// Cache for market status to avoid excessive API calls
const marketStatusCache: Record<string, { status: boolean; timestamp: number }> = {};

// Cache expiry in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

/**
 * Checks if the market for a specific symbol is currently open
 * Uses a cache to reduce API calls, refreshing every 5 minutes
 */
export const isMarketOpen = async (symbol: string): Promise<boolean> => {
  const now = Date.now();
  
  // Check cache first
  if (marketStatusCache[symbol] && (now - marketStatusCache[symbol].timestamp) < CACHE_EXPIRY) {
    return marketStatusCache[symbol].status;
  }
  
  try {
    // Call our Edge Function to check market status
    const { data, error } = await supabase.functions.invoke('check-market-status', {
      body: { symbol }
    });
    
    if (error) {
      console.error('Error checking market status:', error);
      return true; // Default to open on error to ensure countdown continues if check fails
    }
    
    // Update cache
    marketStatusCache[symbol] = {
      status: data.isOpen,
      timestamp: now
    };
    
    return data.isOpen;
  } catch (error) {
    console.error('Error in isMarketOpen:', error);
    return true; // Default to open on error
  }
};
