import { CacheManagerOptions } from '@nestjs/common'
import type { RedisScripts } from 'redis'
import type RedisCacheStore from '../providers/cache-store.provider'
import RedisClientOptions from './client-options.abstract'

/**
 * @file RedisModule Abstracts - RedisCacheOptions
 * @module sneusers/modules/redis/abstracts/RedisCacheOptions
 */

/**
 * Redis cache options.
 *
 * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @template S - [Lua Scripts][1]
 *
 * @abstract
 * @extends {RedisClientOptions<S>}
 * @implements {Omit<CacheManagerOptions, 'store'>}
 */
abstract class RedisCacheOptions<S extends RedisScripts = RedisScripts>
  extends RedisClientOptions<S>
  implements Omit<CacheManagerOptions, 'store'>
{
  isCacheableValue?: CacheManagerOptions['isCacheableValue']
  max?: CacheManagerOptions['max']
  store?: RedisCacheStore
  ttl?: CacheManagerOptions['ttl']
}

export default RedisCacheOptions
