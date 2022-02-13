import type { createClient, RedisClientType, RedisScripts } from 'redis'

/**
 * @file RedisModule Type Definitions - RedisClient
 * @module sneusers/modules/redis/types/RedisClient
 */

/**
 * Redis client type.
 *
 * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @see {@link RedisClientType}
 *
 * @template S - [Lua Scripts][1]
 */
type RedisClient<S extends RedisScripts = RedisScripts> = RedisClientType<
  {},
  S
> &
  ReturnType<typeof createClient>

export default RedisClient
