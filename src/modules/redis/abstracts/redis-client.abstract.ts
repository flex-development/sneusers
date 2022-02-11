import Client from '@node-redis/client/dist/lib/client'
import type { RedisModules, RedisScripts } from 'redis'

/**
 * @file RedisModule Abstracts - RedisClient
 * @module sneusers/modules/redis/abstracts/RedisClient
 */

/**
 * [`Redis`][1] client.
 *
 * [1]: https://github.com/redis/node-redis
 * [2]: https://github.com/redis/node-redis/blob/master/README.md#packages
 * [3]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @template M - [Redis Modules][2]
 * @template S - [Lua Scripts][3]
 *
 * @abstract
 * @extends {Client<M,S>}
 */
abstract class RedisClient<
  M extends RedisModules = RedisModules,
  S extends RedisScripts = RedisScripts
> extends Client<M, S> {}

export default RedisClient
