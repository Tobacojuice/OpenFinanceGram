/**
 * OpenBB Detection Utility
 * Checks for local OpenBB installation with aggressive caching
 */

const CACHE_KEY = 'openbb-detection-status';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PORTS = [6900, 8000, 3000]; // Common OpenBB ports

interface DetectionCache {
  isInstalled: boolean;
  timestamp: number;
  port?: number;
}

/**
 * Check if OpenBB is running on a specific port
 */
async function checkPort(port: number): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    const response = await fetch(`http://localhost:${port}/api/v1/health`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors', // Avoid CORS issues
    });

    clearTimeout(timeoutId);
    return true; // If no error, OpenBB is running
  } catch {
    return false;
  }
}

/**
 * Get cached detection result if valid
 */
function getCachedResult(): DetectionCache | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: DetectionCache = JSON.parse(cached);
    const age = Date.now() - data.timestamp;

    if (age < CACHE_DURATION) {
      return data;
    }

    // Cache expired
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Cache detection result
 */
function cacheResult(isInstalled: boolean, port?: number): void {
  try {
    const data: DetectionCache = {
      isInstalled,
      timestamp: Date.now(),
      port,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore cache errors
  }
}

/**
 * Main detection function with caching
 */
export async function detectOpenBB(): Promise<{ isInstalled: boolean; port?: number }> {
  // Check cache first
  const cached = getCachedResult();
  if (cached !== null) {
    console.log('Using cached OpenBB detection:', cached);
    return { isInstalled: cached.isInstalled, port: cached.port };
  }

  // Check all ports concurrently
  console.time('OpenBB detection');
  const results = await Promise.all(PORTS.map(checkPort));
  console.timeEnd('OpenBB detection');

  const installedPortIndex = results.findIndex(result => result);
  const isInstalled = installedPortIndex !== -1;
  const port = isInstalled ? PORTS[installedPortIndex] : undefined;

  // Cache result
  cacheResult(isInstalled, port);

  return { isInstalled, port };
}

/**
 * Clear detection cache (useful after OpenBB installation/uninstallation)
 */
export function clearDetectionCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Get OpenBB URL based on detection
 */
export function getOpenBBUrl(port?: number): string {
  return port ? `http://localhost:${port}` : 'https://openbb.co';
}
