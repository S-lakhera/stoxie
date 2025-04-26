// utils/cache.js
const cache = new Map();

export const setCache = (key, data, ttlSeconds = 60) => {
    cache[key] = {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    };
    // console.log(`📦 Cache SET for key: ${key} (TTL: ${ttlSeconds}s)`);
  };
  

export const getCache = (key) => {
    const entry = cache[key];
    if (entry) {
      const isExpired = Date.now() > entry.expiry;
      if (!isExpired) {
        // console.log(`🧠 Cache HIT for key: ${key}`);
        return entry.data;
      } else {
        // console.log(`⏰ Cache EXPIRED for key: ${key}`);
        delete cache[key];
      }
    } else {
      // console.log(`💨 Cache MISS for key: ${key}`);
    }
    return null;
  };
  

export const clearCache = () => {
  cache.clear();
};
