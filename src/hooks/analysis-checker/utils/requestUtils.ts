
/**
 * Clear any pending requests and abort controllers
 */
export const clearPendingRequests = (
  controllerRef: React.MutableRefObject<AbortController | null>,
  requestTimeoutRef: React.MutableRefObject<number | null>,
  requestInProgressRef: React.MutableRefObject<boolean>
) => {
  if (requestTimeoutRef.current !== null) {
    window.clearTimeout(requestTimeoutRef.current);
    requestTimeoutRef.current = null;
  }
  
  if (controllerRef.current) {
    controllerRef.current.abort();
    controllerRef.current = null;
  }
  
  requestInProgressRef.current = false;
};

/**
 * Check if error is related to authentication
 */
export const isAuthError = (error: unknown): boolean => {
  return error instanceof Error && 
    (error.message.includes('auth') || 
     error.message.includes('jwt') || 
     error.message.includes('token') ||
     error.message.includes('session'));
};

/**
 * Check if error is an abort error
 */
export const isAbortError = (error: unknown): boolean => {
  return error instanceof DOMException && error.name === 'AbortError';
};
