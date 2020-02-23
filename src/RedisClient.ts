import Redis from 'ioredis';

export const RedisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(`${process.env.REDIS_PORT}`, 10) || 6379
});
