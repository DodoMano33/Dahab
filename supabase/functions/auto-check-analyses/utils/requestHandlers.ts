
import { corsHeaders } from '../../_shared/cors.ts';

/**
 * Handles OPTIONS requests for CORS preflight
 */
export function handleOptionsRequest() {
  console.log('Handling OPTIONS request');
  return new Response(null, { headers: corsHeaders });
}

/**
 * Handles errors and returns a standardized JSON response
 */
export function handleError(error: any, statusCode: number = 200) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Handling error:', errorMessage, error);
  
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
 * Parse request body with error handling
 */
export async function parseRequestBody(req: Request): Promise<{ data: any, error: any }> {
  try {
    if (req.method !== 'POST') {
      console.log('Received non-POST request');
      return { data: {}, error: null };
    }
    
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Request is not JSON type:', contentType);
      return { data: {}, error: new Error('Request must be JSON') };
    }
    
    try {
      const bodyText = await req.text();
      console.log('Request body text:', bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        console.warn('Empty request body');
        return { data: {}, error: null };
      }
      
      const data = JSON.parse(bodyText);
      console.log('Parsed request data:', data);
      return { data, error: null };
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return { data: {}, error: new Error(`JSON parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`) };
    }
  } catch (e) {
    console.error('Exception in parseRequestBody:', e);
    return { data: {}, error: e };
  }
}

/**
 * Creates a success response with standardized format
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
