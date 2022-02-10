import redis from 'redis'

/**
 * @file RedisModule Abstracts - RedisClient
 * @module sneusers/modules/redis/abstracts/RedisClient
 */

abstract class RedisClient extends redis.RedisClient {}

export default RedisClient
