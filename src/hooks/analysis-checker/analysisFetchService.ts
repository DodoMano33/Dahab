
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
    
    console.log('Sending fetch request to:', `${supabaseUrl}/functions/auto-check-analyses`);
    console.log('With body:', JSON.stringify(requestBody));
    
    const response = await fetch(`${supabaseUrl}/functions/auto-check-analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
        'Authorization': authSession?.session?.access_token 
          ? `Bearer ${authSession.session.access_token}` 
          : ''
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error(`Error status: ${response.status} ${response.statusText}, Body: ${responseText}`);
      throw new Error(`Error status: ${response.status} ${response.statusText}, Server response: ${responseText}`);
    }
    
    const responseText = await response.text();
    
    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError, 'Raw response:', responseText);
      throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
    }
  } catch (error) {
    // تحسين رسائل الخطأ لتمييز أنواع مختلفة من الأخطاء
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Request was aborted due to timeout');
      throw new Error('Request timed out');
    }
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Network error:', error);
      throw new Error('Network connection error - please check your internet connection');
    }
    
    console.error('Error in fetchAnalysesWithCurrentPrice:', error);
    throw error;
  }
};
