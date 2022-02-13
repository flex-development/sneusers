import type RedisClient from './client.type'

/**
 * @file RedisModule Type Definitions - SetOptions
 * @module sneusers/modules/redis/types/SetOptions
 */

/**
 * Redis [`SET`][1] options.
 *
 * [1]: https://redis.io/commands/set
 */
type SetOptions = NonNullable<Parameters<RedisClient['set']>[3]>

export default SetOptions
