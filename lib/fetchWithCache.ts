/**
 * A lightweight caching wrapper around the native fetch API.
 * This is designed to reduce redundant GET requests to the backend.
 */

interface CacheItem {
    text: string;
    headers: [string, string][];
    expiry: number;
}

const cache = new Map<string, CacheItem>();

// Default cache duration: 5 minutes
const DEFAULT_TTL = 5 * 60 * 1000;

export async function fetchWithCache(url: string | URL | Request, options?: RequestInit, ttl: number = DEFAULT_TTL): Promise<Response> {
    const urlString = url.toString();
    const method = options?.method?.toUpperCase() || 'GET';

    // Only cache GET requests
    if (method !== 'GET') {
        // If it's a mutation (POST, PATCH, PUT, DELETE), we should invalidate the cache.
        // We extract the base resource from the URL (e.g. /leads/import-bulk -> /leads)
        // to ensure we clear all cached GET requests for that resource.
        let resourcePrefix = urlString.split('?')[0];
        try {
            const urlObj = new URL(urlString);
            const pathSegments = urlObj.pathname.split('/').filter(Boolean);
            if (pathSegments.length > 0) {
                resourcePrefix = `${urlObj.origin}/${pathSegments[0]}`;
            }
        } catch (e) {
            // fallback if URL parsing fails
        }

        const keysToDelete: string[] = [];
        for (const key of cache.keys()) {
            if (key.startsWith(resourcePrefix)) {
                keysToDelete.push(key);
            }
        }
        
        for (const key of keysToDelete) {
            cache.delete(key);
        }

        // Proceed with the actual network request
        return fetch(url, options);
    }

    // For GET requests, check if we have a valid cached response
    const cacheKey = urlString;
    const cachedItem = cache.get(cacheKey);

    if (cachedItem && Date.now() < cachedItem.expiry) {
        // Return a new Response object constructed from the cached text and headers
        return new Response(cachedItem.text, {
            status: 200,
            headers: new Headers(cachedItem.headers)
        });
    }

    // Perform the actual network request if not cached or expired
    const response = await fetch(url, options);

    // If the request was successful, cache the response body and headers
    if (response.ok) {
        try {
            // Clone the response because reading the text consumes the stream
            const clonedResponse = response.clone();
            const text = await clonedResponse.text();
            
            // Convert headers to an array of tuples so they can be safely stored and recreated
            const headersArray: [string, string][] = [];
            clonedResponse.headers.forEach((value, key) => {
                headersArray.push([key, value]);
            });

            cache.set(cacheKey, {
                text,
                headers: headersArray,
                expiry: Date.now() + ttl
            });
        } catch (err) {
            console.error('Failed to cache fetch response:', err);
        }
    }

    return response;
}
