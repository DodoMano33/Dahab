
import { corsHeaders } from '../../_shared/cors.ts';

/**
 * التعامل مع طلبات OPTIONS للمعلومات المسبقة عن CORS
 */
export function handleOptionsRequest() {
  console.log('التعامل مع طلب OPTIONS');
  return new Response(null, { 
    headers: corsHeaders,
    status: 204 // ضبط رمز الحالة الصحيح للطلبات المسبقة
  });
}

/**
 * التعامل مع الأخطاء وإرجاع استجابة JSON موحدة
 */
export function handleError(error: any, statusCode: number = 200) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('التعامل مع الخطأ:', errorMessage, error instanceof Error ? error.stack : '');
  
  return new Response(
    JSON.stringify({
      error: errorMessage,
      timestamp: new Date().toISOString(),
      status: 'error but continuing',
      success: false
    }),
    {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * تحليل هيكل الطلب مع معالجة الأخطاء
 */
export async function parseRequestBody(req: Request): Promise<{ data: any, error: any }> {
  try {
    if (req.method !== 'POST') {
      console.log('تم استلام طلب غير POST');
      return { data: {}, error: null };
    }
    
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('الطلب ليس من نوع JSON:', contentType);
      return { data: {}, error: new Error('يجب أن يكون الطلب بصيغة JSON') };
    }
    
    try {
      const bodyText = await req.text();
      
      if (!bodyText || bodyText.trim() === '') {
        console.warn('نص الطلب فارغ');
        return { data: {}, error: null };
      }
      
      try {
        const data = JSON.parse(bodyText);
        console.log('تم تحليل بيانات الطلب');
        return { data, error: null };
      } catch (parseError) {
        console.error('خطأ في تحليل نص الطلب:', parseError, 'النص الأصلي:', bodyText);
        return { data: {}, error: new Error(`خطأ في تحليل JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`) };
      }
    } catch (textError) {
      console.error('خطأ في الحصول على نص الطلب:', textError);
      return { data: {}, error: new Error(`خطأ في قراءة نص الطلب: ${textError instanceof Error ? textError.message : String(textError)}`) };
    }
  } catch (e) {
    console.error('استثناء في parseRequestBody:', e);
    return { data: {}, error: e };
  }
}

/**
 * إنشاء استجابة نجاح بتنسيق موحد
 */
export function createSuccessResponse(data: any) {
  return new Response(
    JSON.stringify({
      ...data,
      success: true,
      timestamp: data.timestamp || new Date().toISOString()
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  );
}
