import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export const getRedis = (): Redis => {
    if (!redis) {
        const url = process.env.KV_REST_API_URL;
        const token = process.env.KV_REST_API_TOKEN;

        console.log('Redis configuration:', {
            url,
            tokenLoaded: !!token
        });

        if (!url || !token) {
            throw new Error('Redis environment variables are not configured.');
        }

        redis = new Redis({ url, token });
    }

    return redis;
};