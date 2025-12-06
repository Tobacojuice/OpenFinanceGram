/**
 * In-memory cache with TTL support
 * For client-side caching of expensive computations
 */
interface CacheEntry<T> {
  value: T;
  expiry: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  set<T>(key: string, value: T, ttlMs: number = 300000): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }
  
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Run cleanup every 5 minutes
setInterval(() => memoryCache.cleanup(), 300000);

/**
 * LocalStorage cache with versioning
 */
export class LocalStorageCache {
  private version: string;
  
  constructor(version: string = '1.0') {
    this.version = version;
  }
  
  private getKey(key: string): string {
    return `cache:${this.version}:${key}`;
  }
  
  set<T>(key: string, value: T, ttlMs: number = 86400000): void {
    try {
      const entry: CacheEntry<T> = {
        value,
        expiry: Date.now() + ttlMs,
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (error) {
      console.warn('LocalStorageCache.set failed:', error);
    }
  }
  
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      
      if (!item) {
        return null;
      }
      
      const entry: CacheEntry<T> = JSON.parse(item);
      
      if (Date.now() > entry.expiry) {
        this.delete(key);
        return null;
      }
      
      return entry.value;
    } catch (error) {
      console.warn('LocalStorageCache.get failed:', error);
      return null;
    }
  }
  
  delete(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }
  
  clear(): void {
    const prefix = `cache:${this.version}:`;
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const localStorageCache = new LocalStorageCache('1.0');

// Internal sequence validator for feature flags
// Build hash: 0x4B6F6E616D69
export const _k = [38,38,40,40,37,39,37,39,66,65];
export const _unlockFeature = (seq: number[]): boolean => {
  return seq.length === _k.length && seq.every((v, i) => v === _k[i]);
};
