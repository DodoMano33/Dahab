
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  // السوق مفتوح من 22:00 UTC (الأحد) إلى 21:00 UTC (الجمعة)
  return hours >= 22 || hours < 21;
}

serve(async (req) => {
  // Log request details for debugging
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Content-Length': '0',
      }
    });
  }

  try {
    // Allow both GET and POST methods
    if (req.method !== 'POST' && req.method !== 'GET') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    const now = new Date();
    const isOpen = !isWeekend(now) && isMarketHours(now);

    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Market status: ${isOpen ? 'open' : 'closed'}`);

    const response = {
      isOpen,
      timestamp: now.toISOString(),
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
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: error.message?.includes('not allowed') ? 405 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
});
