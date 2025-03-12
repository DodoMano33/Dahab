
import { supabase } from '@/lib/supabase';

export const fetchAnalysesWithCurrentPrice = async (
  price: number | null,
  symbol: string,
  controller: AbortController
): Promise<any> => {
  const requestBody: Record<string, any> = { 
    symbol,
    requestedAt: new Date().toISOString()
  };
  
  if (price !== null) {
    requestBody.currentPrice = price;
  }

  const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
  const { data: authSession } = await supabase.auth.getSession();
  
  // تحسين المعلومات التشخيصية
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
      'Authorization': authSession?.session?.access_token 
        ? `Bearer ${authSession.session.access_token}` 
        : ''
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  };

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/auto-check-analyses`, requestOptions);
    
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
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.');
    }
    throw error;
  }
};
