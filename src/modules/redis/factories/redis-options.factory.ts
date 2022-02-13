import type { OrPromise } from '@flex-development/tutils'
import type { RedisScripts } from 'redis'
import type { RedisClientOptions } from '../abstracts'

/**
 * @file RedisModule Factories - RedisOptionsFactory
 * @module sneusers/modules/redis/factories/RedisOptionsFactory
 */

/**
 * Creates {@link RedisClientOptions}.
 *
 * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @template S - [Lua Scripts][1]
 *
 * @abstract
 */
abstract class RedisOptionsFactory<S extends RedisScripts = RedisScripts> {
  abstract createRedisOptions(): OrPromise<RedisClientOptions<S>>
}

export default RedisOptionsFactory
