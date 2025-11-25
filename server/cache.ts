import Redis from 'ioredis';
import { logger } from './middleware/logger';

let redis: Redis | null = null;

// Initialize Redis client
export function initRedis() {
    if (process.env.REDIS_URL) {
        try {
            redis = new Redis(process.env.REDIS_URL, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
            });

            redis.on('connect', () => {
                logger.info('Redis connected');
            });

            redis.on('error', (err) => {
                logger.error({ err }, 'Redis error');
            });

            return redis;
        } catch (error) {
            logger.warn({ error }, 'Redis initialization failed, caching disabled');
            return null;
        }
    } else {
        logger.info('REDIS_URL not set, caching disabled');
        return null;
    }
}

// Cache utilities
export async function getCache<T>(key: string): Promise<T | null> {
    if (!redis) return null;

    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error({ error, key }, 'Cache get error');
        return null;
    }
}

export async function setCache(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (!redis) return;

    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
        logger.error({ error, key }, 'Cache set error');
    }
}

export async function deleteCache(key: string): Promise<void> {
    if (!redis) return;

    try {
        await redis.del(key);
    } catch (error) {
        logger.error({ error, key }, 'Cache delete error');
    }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
    if (!redis) return;

    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        logger.error({ error, pattern }, 'Cache pattern delete error');
    }
}

export { redis };
