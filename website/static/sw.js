/**
 * Enterprise Service Worker for OVH Snowflake Terraform Provider Documentation
 * Built by Spectrum Web Co - State-of-the-art offline functionality
 * Version: 1.0.0
 * Last Updated: 2024-12-19
 */

const CACHE_NAME = 'ovh-snowflake-provider-v1.0.0';
const STATIC_CACHE = 'ovh-snowflake-static-v1.0.0';
const DYNAMIC_CACHE = 'ovh-snowflake-dynamic-v1.0.0';
const API_CACHE = 'ovh-snowflake-api-v1.0.0';
const IMAGES_CACHE = 'ovh-snowflake-images-v1.0.0';

// Cache duration in milliseconds
const CACHE_DURATION = {
  STATIC: 30 * 24 * 60 * 60 * 1000,     // 30 days
  DYNAMIC: 7 * 24 * 60 * 60 * 1000,     // 7 days
  API: 1 * 60 * 60 * 1000,              // 1 hour
  IMAGES: 30 * 24 * 60 * 60 * 1000      // 30 days
};

// Files to cache immediately on install
const ESSENTIAL_CACHE_URLS = [
  '/terraform-provider-ovh-snowflake/',
  '/terraform-provider-ovh-snowflake/docs/intro',
  '/terraform-provider-ovh-snowflake/docs/getting-started/installation',
  '/terraform-provider-ovh-snowflake/docs/getting-started/authentication',
  '/terraform-provider-ovh-snowflake/manifest.json',
  '/terraform-provider-ovh-snowflake/offline.html'
];

// Static assets that should be cached
const STATIC_ASSETS = [
  // Fonts
  '/fonts/Mona-Sans.var.woff2',
  
  // Icons and favicons
  '/favicon.ico',
  '/img/favicon-16x16.png',
  '/img/favicon-32x32.png',
  '/img/icon-192x192.png',
  '/img/icon-384x384.png',
  '/img/icon-512x512.png',
  '/img/apple-touch-icon.png',
  '/img/icon.svg',
  '/img/transparent-icon.png',
  
  // Brand assets
  '/img/spectrumwebco-light.png',
  '/img/spectrumwebco-dark.png',
  '/img/logo.svg',
  '/img/logo-dark.svg'
];

// Network timeout for fetch requests
const NETWORK_TIMEOUT = 5000;

// Maximum cache size (in bytes)
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Utility Functions
 */

// Add timestamp to cached responses for expiration management
function addCacheTimestamp(response) {
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.set('sw-cache-timestamp', Date.now().toString());
  
  return new Response(clonedResponse.body, {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers: headers
  });
}

// Check if cached response is expired
function isCacheExpired(response, maxAge) {
  const cacheTimestamp = response.headers.get('sw-cache-timestamp');
  if (!cacheTimestamp) return true;
  
  const age = Date.now() - parseInt(cacheTimestamp);
  return age > maxAge;
}

// Clean up expired cache entries
async function cleanupExpiredCache(cacheName, maxAge) {
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response && isCacheExpired(response, maxAge)) {
        await cache.delete(request);
        console.log('SW: Cleaned up expired cache entry:', request.url);
      }
    }
  } catch (error) {
    console.error('SW: Error cleaning up cache:', error);
  }
}

// Manage cache size
async function manageCacheSize(cacheName, maxSize) {
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    let totalSize = 0;
    const entries = [];
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const size = parseInt(response.headers.get('content-length')) || 0;
        totalSize += size;
        entries.push({
          request,
          size,
          timestamp: parseInt(response.headers.get('sw-cache-timestamp')) || 0
        });
      }
    }
    
    if (totalSize > maxSize) {
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);
      
      let removedSize = 0;
      for (const entry of entries) {
        if (totalSize - removedSize <= maxSize) break;
        
        await cache.delete(entry.request);
        removedSize += entry.size;
        console.log('SW: Removed cache entry for size management:', entry.request.url);
      }
    }
  } catch (error) {
    console.error('SW: Error managing cache size:', error);
  }
}

// Create timeout promise for network requests
function createTimeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Network timeout')), timeout);
  });
}

// Enhanced fetch with timeout
async function fetchWithTimeout(request, timeout = NETWORK_TIMEOUT) {
  try {
    return await Promise.race([
      fetch(request),
      createTimeoutPromise(timeout)
    ]);
  } catch (error) {
    console.warn('SW: Network request failed:', error);
    throw error;
  }
}

// Determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Static assets: Cache first
  if (pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico)$/)) {
    return 'cache-first';
  }
  
  // API endpoints: Network first with short cache
  if (pathname.includes('/api/')) {
    return 'network-first-short';
  }
  
  // Documentation pages: Stale while revalidate
  if (pathname.includes('/docs/') || pathname.includes('/community/')) {
    return 'stale-while-revalidate';
  }
  
  // Default: Network first
  return 'network-first';
}

// Get appropriate cache name based on content type
function getCacheName(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
    return IMAGES_CACHE;
  }
  
  if (pathname.match(/\.(css|js|woff2?)$/)) {
    return STATIC_CACHE;
  }
  
  if (pathname.includes('/api/')) {
    return API_CACHE;
  }
  
  return DYNAMIC_CACHE;
}

/**
 * Cache Strategies
 */

// Cache first strategy (for static assets)
async function cacheFirst(request) {
  const cacheName = getCacheName(request);
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isCacheExpired(cachedResponse, CACHE_DURATION.STATIC)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetchWithTimeout(request);
    if (networkResponse.ok) {
      const responseToCache = addCacheTimestamp(networkResponse);
      await cache.put(request, responseToCache.clone());
    }
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      console.log('SW: Serving stale cache due to network error');
      return cachedResponse;
    }
    throw error;
  }
}

// Network first strategy
async function networkFirst(request) {
  const cacheName = getCacheName(request);
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetchWithTimeout(request);
    if (networkResponse.ok) {
      const responseToCache = addCacheTimestamp(networkResponse);
      await cache.put(request, responseToCache.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache:', error.message);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/terraform-provider-ovh-snowflake/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Network first with short cache (for API endpoints)
async function networkFirstShort(request) {
  const cacheName = API_CACHE;
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetchWithTimeout(request, 3000); // Shorter timeout for API
    if (networkResponse.ok) {
      const responseToCache = addCacheTimestamp(networkResponse);
      await cache.put(request, responseToCache.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isCacheExpired(cachedResponse, CACHE_DURATION.API)) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cacheName = getCacheName(request);
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Start network request immediately
  const networkPromise = fetchWithTimeout(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        const responseToCache = addCacheTimestamp(networkResponse);
        await cache.put(request, responseToCache.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.log('SW: Background update failed:', error.message);
      return null;
    });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Update cache in background
    networkPromise;
    return cachedResponse;
  }
  
  // Wait for network if no cache available
  try {
    return await networkPromise;
  } catch (error) {
    throw error;
  }
}

/**
 * Event Handlers
 */

// Service Worker Installation
self.addEventListener('install', (event) => {
  console.log('SW: Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache essential files
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(ESSENTIAL_CACHE_URLS.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      }),
      
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      })
    ]).then(() => {
      console.log('SW: Installation complete');
      return self.skipWaiting();
    }).catch(error => {
      console.error('SW: Installation failed:', error);
    })
  );
});

// Service Worker Activation
self.addEventListener('activate', (event) => {
  console.log('SW: Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        const validCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGES_CACHE];
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!validCaches.includes(cacheName)) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('SW: Activation complete');
    })
  );
});

// Fetch Event Handler
self.addEventListener('fetch', (event) => {
  // Only handle HTTP(S) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Skip requests with specific headers (like range requests)
  if (event.request.headers.get('range')) {
    return;
  }
  
  const strategy = getCacheStrategy(event.request);
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case 'cache-first':
            return await cacheFirst(event.request);
          case 'network-first-short':
            return await networkFirstShort(event.request);
          case 'stale-while-revalidate':
            return await staleWhileRevalidate(event.request);
          default:
            return await networkFirst(event.request);
        }
      } catch (error) {
        console.error('SW: Fetch failed:', event.request.url, error);
        
        // Return generic offline response for navigation requests
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(DYNAMIC_CACHE);
          const offlineResponse = await cache.match('/terraform-provider-ovh-snowflake/offline.html');
          if (offlineResponse) {
            return offlineResponse;
          }
        }
        
        // Return a basic offline response
        return new Response('Offline - Content not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Background Sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      Promise.all([
        cleanupExpiredCache(STATIC_CACHE, CACHE_DURATION.STATIC),
        cleanupExpiredCache(DYNAMIC_CACHE, CACHE_DURATION.DYNAMIC),
        cleanupExpiredCache(API_CACHE, CACHE_DURATION.API),
        cleanupExpiredCache(IMAGES_CACHE, CACHE_DURATION.IMAGES),
        manageCacheSize(DYNAMIC_CACHE, MAX_CACHE_SIZE * 0.4),
        manageCacheSize(IMAGES_CACHE, MAX_CACHE_SIZE * 0.3)
      ])
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('SW: Received message:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'CACHE_URLS':
        if (event.data.urls && Array.isArray(event.data.urls)) {
          event.waitUntil(
            caches.open(DYNAMIC_CACHE).then(cache => {
              return cache.addAll(event.data.urls);
            })
          );
        }
        break;
        
      case 'CLEAR_CACHE':
        event.waitUntil(
          caches.keys().then(cacheNames => {
            return Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
          })
        );
        break;
        
      case 'GET_CACHE_SIZE':
        event.waitUntil(
          (async () => {
            let totalSize = 0;
            const cacheNames = await caches.keys();
            
            for (const cacheName of cacheNames) {
              const cache = await caches.open(cacheName);
              const requests = await cache.keys();
              
              for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                  const size = parseInt(response.headers.get('content-length')) || 0;
                  totalSize += size;
                }
              }
            }
            
            event.ports[0].postMessage({ totalSize });
          })()
        );
        break;
    }
  }
});

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-maintenance') {
    event.waitUntil(
      Promise.all([
        cleanupExpiredCache(STATIC_CACHE, CACHE_DURATION.STATIC),
        cleanupExpiredCache(DYNAMIC_CACHE, CACHE_DURATION.DYNAMIC),
        cleanupExpiredCache(API_CACHE, CACHE_DURATION.API),
        manageCacheSize(DYNAMIC_CACHE, MAX_CACHE_SIZE)
      ])
    );
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('SW: Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('SW: Unhandled promise rejection:', event.reason);
});

console.log('SW: Service worker loaded successfully');