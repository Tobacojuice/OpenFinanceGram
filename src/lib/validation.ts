import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');

// Password validation
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters');

// LinkedIn URL validation
export const linkedInUrlSchema = z
  .string()
  .url('Invalid URL')
  .regex(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/, 'Invalid LinkedIn profile URL');

// Stock symbol validation
export const symbolSchema = z
  .string()
  .min(1, 'Symbol is required')
  .max(10, 'Symbol must be less than 10 characters')
  .regex(/^[A-Z0-9.]+$/, 'Symbol must contain only uppercase letters, numbers, and periods');

// Trade quantity validation
export const quantitySchema = z
  .number()
  .positive('Quantity must be positive')
  .max(1000000, 'Quantity too large');

// Price validation
export const priceSchema = z
  .number()
  .positive('Price must be positive')
  .max(1000000, 'Price too large');

// CV Data validation
export const cvDataSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: emailSchema,
  phone: z.string().regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number').max(20),
  location: z.string().min(1, 'Location is required').max(100),
  linkedin: linkedInUrlSchema.optional().or(z.literal('')),
  summary: z.string().max(1000, 'Summary must be less than 1000 characters'),
  experience: z.array(z.object({
    company: z.string().min(1).max(100),
    position: z.string().min(1).max(100),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    description: z.string().max(500),
  })),
  education: z.array(z.object({
    institution: z.string().min(1).max(100),
    degree: z.string().min(1).max(100),
    field: z.string().min(1).max(100),
    graduationDate: z.string().min(1),
  })),
  skills: z.array(z.string().max(50)).max(50, 'Maximum 50 skills'),
  certifications: z.array(z.string().max(100)).max(20, 'Maximum 20 certifications'),
});

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 1000); // Limit length
}

// Validate and sanitize stock symbol
export function validateSymbol(symbol: string): string {
  const sanitized = symbol.toUpperCase().trim().replace(/[^A-Z0-9.]/g, '');
  const result = symbolSchema.safeParse(sanitized);
  
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  
  return sanitized;
}

// Validate email
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message?: string } {
  const result = passwordSchema.safeParse(password);
  
  if (!result.success) {
    return { valid: false, message: result.error.issues[0].message };
  }
  
  return { valid: true };
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}
  
  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
  
  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
  
  reset(key: string): void {
    this.requests.delete(key);
  }
}
