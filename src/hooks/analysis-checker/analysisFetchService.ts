
import { supabase } from '@/lib/supabase';

export const fetchAnalysesWithCurrentPrice = async (
  price: number | null,
  symbol: string,
  controller: AbortController
): Promise<any> => {
  // تثبيت الرمز على XAUUSD
  const fixedSymbol = "XAUUSD";
  
  if (price === null) {
    console.error('No price provided to fetchAnalysesWithCurrentPrice');
    throw new Error('لا يمكن التحقق من التحليلات: السعر غير متاح. يرجى التأكد من أن الرسم البياني يعمل بشكل صحيح.');
  }
  
  const requestBody: Record<string, any> = { 
    symbol: fixedSymbol,
    requestedAt: new Date().toISOString(),
    currentPrice: price
  };
  
  console.log('Sending analysis check request with price:', price);

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
    console.log(`Sending request to check analyses for XAUUSD with price: ${price}`);
    const response = await fetch(`${supabaseUrl}/functions/v1/auto-check-analyses`, requestOptions);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error(`Error status: ${response.status} ${response.statusText}, Body: ${responseText}`);
      throw new Error(`Error status: ${response.status} ${response.statusText}, Server response: ${responseText}`);
    }
    
    const responseText = await response.text();
    console.log('Response received from server:', responseText.substring(0, 200) + '...');
    
    try {
      const parsedResponse = JSON.parse(responseText);
      // إضافة السعر للاستجابة إذا لم يكن موجوداً بالفعل
      if (!parsedResponse.price && price) {
        parsedResponse.price = price;
      }
      return parsedResponse;
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError, 'Raw response:', responseText);
      throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error: Failed to fetch. Check internet connection.');
      throw new Error('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.');
    }
    console.error('Error in fetchAnalysesWithCurrentPrice:', error);
    throw error;
  }
};
