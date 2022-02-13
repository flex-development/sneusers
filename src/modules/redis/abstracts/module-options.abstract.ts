import type { RedisScripts } from 'redis'
import RedisClientOptions from './client-options.abstract'

/**
 * @file RedisModule Abstracts - RedisModuleOptions
 * @module sneusers/modules/redis/abstracts/RedisModuleOptions
 */

/**
 * `RedisModule` options.
 *
 * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @template S - [Lua Scripts][1]
 *
 * @abstract
 * @implements {RedisClientOptions<S>}
 */
abstract class RedisModuleOptions<
  S extends RedisScripts = RedisScripts
> extends RedisClientOptions<S> {}

export default RedisModuleOptions
