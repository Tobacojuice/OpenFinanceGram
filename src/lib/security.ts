// Security utilities

/**
 * Content Security Policy configuration
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.polygon.io',
    'https://financialmodelingprep.com',
    'https://api.openai.com',
  ],
  'media-src': ["'self'", 'https:', 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * HSTS configuration for production
 */
export const HSTS_HEADER = 'max-age=63072000; includeSubDomains; preload';

/**
 * Apply security headers to fetch responses
 */
export function applySecurityHeaders(headers: HeadersInit = {}): HeadersInit {
  return {
    ...headers,
    'Content-Security-Policy': generateCSPHeader(),
    'Strict-Transport-Security': HSTS_HEADER,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Sanitize URL to prevent open redirects
 */
export function sanitizeRedirectUrl(url: string, allowedDomains: string[] = []): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow same origin or explicitly allowed domains
    if (parsed.origin === window.location.origin) {
      return url;
    }
    
    if (allowedDomains.some(domain => parsed.hostname.endsWith(domain))) {
      return url;
    }
    
    return null;
  } catch {
    // Invalid URL
    return null;
  }
}

/**
 * Check if string contains potentially dangerous content
 */
export function containsDangerousContent(input: string): boolean {
  const dangerousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Generate secure random string
 */
export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash data using SubtleCrypto
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Secure session storage wrapper
 */
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'fg-secure-';
  
  static setItem(key: string, value: string): void {
    try {
      const encrypted = btoa(value); // Basic encoding (should use proper encryption in production)
      sessionStorage.setItem(this.ENCRYPTION_KEY + key, encrypted);
    } catch (error) {
      console.error('SecureStorage.setItem error:', error);
    }
  }
  
  static getItem(key: string): string | null {
    try {
      const encrypted = sessionStorage.getItem(this.ENCRYPTION_KEY + key);
      if (!encrypted) return null;
      return atob(encrypted);
    } catch (error) {
      console.error('SecureStorage.getItem error:', error);
      return null;
    }
  }
  
  static removeItem(key: string): void {
    sessionStorage.removeItem(this.ENCRYPTION_KEY + key);
  }
  
  static clear(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.ENCRYPTION_KEY)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

/**
 * Check for common security headers
 */
export function checkSecurityHeaders(response: Response): void {
  const securityHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
  ];
  
  securityHeaders.forEach(header => {
    if (!response.headers.has(header)) {
      console.warn(`Missing security header: ${header}`);
    }
  });
}
