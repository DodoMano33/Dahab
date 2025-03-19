
import { supabase } from '@/lib/supabase';

export const fetchAnalysesWithCurrentPrice = async (
  price: number | null,
  symbol: string,
  controller: AbortController
): Promise<any> => {
  try {
    const requestBody: Record<string, any> = { 
      symbol,
      requestedAt: new Date().toISOString()
    };
    
    if (price !== null) {
      requestBody.currentPrice = price;
    }

    const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
    const { data: authSession } = await supabase.auth.getSession();
    
    if (!authSession?.session?.access_token) {
      console.error('No auth session available');
      throw new Error('User authentication required');
    }
    
    // إضافة timeout لمنع استمرار الطلب لفترة طويلة
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);
    
    try {
      const response = await fetch(`${supabaseUrl}/functions/auto-check-analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
          'Authorization': `Bearer ${authSession.session.access_token}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        cache: 'no-store',
        credentials: 'omit'
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error(`Error status: ${response.status} ${response.statusText}, Body: ${responseText}`);
        throw new Error(`Error status: ${response.status} ${response.statusText}`);
      }
      
      const responseText = await response.text();
      
      try {
        return JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Raw response:', responseText);
        throw new Error(`Failed to parse JSON response`);
      }
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Request was aborted');
      throw new Error('Request aborted');
    }
    
    console.error('Error in fetchAnalysesWithCurrentPrice:', error);
    throw error;
  }
};
