const cache = new Map();

/**
 * Get resume from cache.
 * Returns null if not found or expired.
 */
export const getCachedResume = (id) => {
    const cached = cache.get(id);
    if (!cached) return null;
    if (Date.now() > cached.expiry) {
        cache.delete(id);
        return null;
    }
    return cached.data;
};

/**
 * Set resume in cache with a TTL (default 5 minutes).
 */
export const setCachedResume = (id, data, ttlMs = 300000) => {
    cache.set(id, {
        data,
        expiry: Date.now() + ttlMs
    });
};

/**
 * Delete resume from cache.
 */
export const deleteCachedResume = (id) => {
    cache.delete(id);
};

/**
 * Clear all cache entries.
 */
export const clearCache = () => {
    cache.clear();
};
