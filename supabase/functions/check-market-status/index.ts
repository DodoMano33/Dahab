
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = new Date();
    const isOpen = !isWeekend(now) && isMarketHours(now);

    console.log(`Checking market status at ${now.toISOString()}`);
    console.log(`Market is ${isOpen ? 'open' : 'closed'}`);

    return new Response(
      JSON.stringify({
        isOpen,
        timestamp: now.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error checking market status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
