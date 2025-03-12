
import { corsHeaders } from '../../_shared/cors.ts';

/**
 * Handles OPTIONS requests for CORS preflight
 */
export function handleOptionsRequest() {
  console.log('Handling OPTIONS request');
  return new Response(null, { headers: corsHeaders });
}
