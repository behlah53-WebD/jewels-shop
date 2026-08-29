// In-memory cache store
const cacheMap = new Map<string, { data: any; timestamp: number }>();
// In-flight pending promises store to deduplicate identical concurrent requests
const pendingPromises = new Map<string, Promise<any>>();

const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds

export async function fetchWithCache(url: string, ttlMs: number = DEFAULT_TTL_MS): Promise<any> {
  const now = Date.now();

  // 1. Bypass cache for private user endpoints (cart, wishlist, orders, auth)
  const isPrivateEndpoint = url.includes("/cart") || url.includes("/wishlist") || url.includes("/orders") || url.includes("/auth/");

  // Return cached response if valid and not expired (only for public data)
  if (!isPrivateEndpoint) {
    const cached = cacheMap.get(url);
    if (cached && now - cached.timestamp < ttlMs) {
      return cached.data;
    }
  }

  // 2. Return pending promise if request is currently inflight (deduplication)
  if (pendingPromises.has(url)) {
    return pendingPromises.get(url)!;
  }

  // 3. Perform fresh network request
  const fetchPromise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success) {
        cacheMap.set(url, { data, timestamp: Date.now() });
      }
      return data;
    } finally {
      pendingPromises.delete(url);
    }
  })();

  pendingPromises.set(url, fetchPromise);
  return fetchPromise;
}

export function invalidateCache(urlPattern?: string) {
  if (!urlPattern) {
    cacheMap.clear();
    return;
  }
  for (const key of cacheMap.keys()) {
    if (key.includes(urlPattern)) {
      cacheMap.delete(key);
    }
  }
}
