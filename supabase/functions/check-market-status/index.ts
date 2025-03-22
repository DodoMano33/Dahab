
// Follow Deno's latest conventions for importing std library
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

function isMarketHours(date: Date): boolean {
  const hours = date.getUTCHours();
  // The market is open from 22:00 UTC (Sunday) to 21:00 UTC (Friday)
  return hours >= 22 || hours < 21;
}

async function getPriceMovement(): Promise<boolean> {
  try {
    // استرجاع آخر سعرين من قاعدة البيانات
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("Missing Supabase credentials");
      return false;
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/real_time_prices?select=price,updated_at&symbol=eq.XAUUSD&order=updated_at.desc&limit=2`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (!response.ok) {
      console.log(`Error fetching prices: ${response.status}`);
      return false;
    }
    
    const prices = await response.json();
    
    if (!prices || prices.length < 2) {
      console.log("Not enough price data");
      return false;
    }
    
    const latestPrice = prices[0].price;
    const previousPrice = prices[1].price;
    const latestUpdateTime = new Date(prices[0].updated_at);
    const now = new Date();
    
    // تحقق مما إذا كان السعر قد تغير وما إذا كان التحديث حديثًا
    const priceHasChanged = Math.abs(latestPrice - previousPrice) > 0.0001;
    const isRecentUpdate = (now.getTime() - latestUpdateTime.getTime()) < 5 * 60 * 1000; // أقل من 5 دقائق
    
    console.log(`Price movement check: Latest=${latestPrice}, Previous=${previousPrice}, Changed=${priceHasChanged}, Recent=${isRecentUpdate}`);
    
    return priceHasChanged && isRecentUpdate;
    
  } catch (error) {
    console.error("Error checking price movement:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Allow both GET and POST methods
    if (req.method !== 'POST' && req.method !== 'GET') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    const now = new Date();
    let isOpen = !isWeekend(now) && isMarketHours(now);
    
    // تحقق من حركة السعر
    const hasPriceMovement = await getPriceMovement();
    
    // إذا كان هناك حركة سعر مؤخرًا، فإن السوق مفتوح
    if (hasPriceMovement) {
      isOpen = true;
    }
    
    // إذا لم تكن هناك حركة سعر والسوق من المفترض أن يكون مفتوحًا (بناءً على التوقيت)، تحقق مرة أخرى
    if (!hasPriceMovement && isOpen) {
      console.log("No price movement detected but market should be open based on time. Double checking...");
      
      // إذا لم يكن هناك حركة أسعار لمدة 5 دقائق، نعتبر السوق مغلقًا بغض النظر عن الوقت
      isOpen = false;
    }

    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Market status: ${isOpen ? 'open' : 'closed'}`);
    console.log(`Price movement detected: ${hasPriceMovement}`);

    const response = {
      isOpen,
      timestamp: now.toISOString(),
      serverTime: now.toISOString(),
      priceMovementDetected: hasPriceMovement
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error in check-market-status:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: error instanceof Error && error.message?.includes('not allowed') ? 405 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
});
