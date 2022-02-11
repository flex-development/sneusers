import type { OrPromise } from '@flex-development/tutils'
import type { RedisClientOptions } from 'redis'

/**
 * @file Factories - RedisOptionsFactory
 * @module sneusers/modules/redis/factories/RedisOptionsFactory
 */

abstract class RedisOptionsFactory {
  abstract createRedisOptions(): OrPromise<RedisClientOptions>
}

export default RedisOptionsFactory
