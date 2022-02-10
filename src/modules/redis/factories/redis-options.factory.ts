import type { OrPromise } from '@flex-development/tutils'
import type { RedisClientOpts } from '@sneusers/modules/redis/interfaces'

/**
 * @file Factories - RedisOptionsFactory
 * @module sneusers/modules/redis/factories/RedisOptionsFactory
 */

abstract class RedisOptionsFactory {
  abstract createRedisOptions(): OrPromise<RedisClientOpts>
}

export default RedisOptionsFactory
