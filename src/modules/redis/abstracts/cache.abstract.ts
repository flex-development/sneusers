import { Cache } from 'cache-manager'
import type { RedisCacheStore } from '../providers'

/**
 * @file RedisModule Abstracts - RedisCache
 * @module sneusers/modules/redis/abstracts/RedisCache
 */

/**
 * Redis cache.
 *
 * @abstract
 * @implements {Cache}
 */
abstract class RedisCache implements Cache {
  abstract del: Cache['del']
  abstract get: Cache['get']
  abstract reset: Cache['reset']
  abstract set: Cache['set']
  abstract store: RedisCacheStore
  abstract wrap: Cache['wrap']
}

export default RedisCache
