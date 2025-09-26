import { redis } from "@/config/index";

const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Cache error:", error);
      return null;
    }
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await redis.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error("Cache error:", error);
    }
  },
};

export default cacheService;
