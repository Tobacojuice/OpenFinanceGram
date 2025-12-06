import { toast } from '@/hooks/use-toast';

export interface APIError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Handle API errors consistently across the application
 */
export function handleAPIError(error: unknown, context?: string): APIError {
  console.error(`API Error${context ? ` [${context}]` : ''}:`, error);

  let errorMessage = 'An unexpected error occurred';
  let status: number | undefined;
  let code: string | undefined;
  let details: unknown;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    
    if (typeof err.message === 'string') {
      errorMessage = err.message;
    }
    
    if (typeof err.status === 'number') {
      status = err.status;
    }
    
    if (typeof err.code === 'string') {
      code = err.code;
    }
    
    details = err.details;
  }

  // Map common error codes to user-friendly messages
  const errorMap: Record<string, string> = {
    '400': 'Invalid request. Please check your input.',
    '401': 'Authentication required. Please sign in.',
    '403': 'Access denied. You do not have permission.',
    '404': 'Resource not found.',
    '429': 'Too many requests. Please try again later.',
    '500': 'Server error. Please try again later.',
    '503': 'Service temporarily unavailable.',
    'ECONNABORTED': 'Request timeout. Please try again.',
    'ENOTFOUND': 'Network error. Please check your connection.',
    'PGRST116': 'No data found.',
  };

  if (status && errorMap[status.toString()]) {
    errorMessage = errorMap[status.toString()];
  } else if (code && errorMap[code]) {
    errorMessage = errorMap[code];
  }

  return {
    message: errorMessage,
    status,
    code,
    details,
  };
}

/**
 * Display API error as toast notification
 */
export function showAPIError(error: unknown, context?: string): void {
  const apiError = handleAPIError(error, context);
  
  toast({
    title: 'Error',
    description: apiError.message,
    variant: 'destructive',
  });
}

/**
 * Retry failed API calls with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: number }).status;
        if (status >= 400 && status < 500) {
          throw error;
        }
      }
      
      // Wait before retry with exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }
  
  throw lastError;
}

/**
 * Check if error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND')
    );
  }
  return false;
}

/**
 * Check if error is authentication-related
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    return status === 401 || status === 403;
  }
  
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    return code === 'PGRST301' || code === 'PGRST302';
  }
  
  return false;
}
