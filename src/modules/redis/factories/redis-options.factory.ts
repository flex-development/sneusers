import type { OrPromise } from '@flex-development/tutils'
import type { RedisClientOptions } from 'redis'

/**
 * @file RedisModule Factories - RedisOptionsFactory
 * @module sneusers/modules/redis/factories/RedisOptionsFactory
 */

/**
 * Creates {@link RedisClientOptions}.
 *
 * @abstract
 */
abstract class RedisOptionsFactory {
  abstract createRedisOptions(): OrPromise<RedisClientOptions>
}

export default RedisOptionsFactory
