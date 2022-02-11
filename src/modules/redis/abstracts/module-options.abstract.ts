import type { RedisClientOptions, RedisModules, RedisScripts } from 'redis'

/**
 * @file RedisModule Abstracts - RedisModuleOptions
 * @module sneusers/modules/redis/abstracts/RedisModuleOptions
 */

/**
 * `RedisModule` options.
 *
 * [1]: https://github.com/redis/node-redis/blob/master/README.md#packages
 * [2]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @template M - [Redis Modules][1]
 * @template S - [Lua Scripts][2]
 *
 * @abstract
 * @implements {RedisClientOptions<M,S>}
 */
abstract class RedisModuleOptions<
  M extends RedisModules = RedisModules,
  S extends RedisScripts = RedisScripts
> implements RedisClientOptions<M, S>
{
  commandsQueueMaxLength?: RedisClientOptions<M, S>['commandsQueueMaxLength']
  database?: RedisClientOptions<M, S>['database']
  isolationPoolOptions?: RedisClientOptions<M, S>['isolationPoolOptions']
  legacyMode?: RedisClientOptions<M, S>['legacyMode']
  modules?: RedisClientOptions<M, S>['modules']
  name?: RedisClientOptions<M, S>['name']
  password?: RedisClientOptions<M, S>['password']
  readonly?: RedisClientOptions<M, S>['readonly']
  scripts?: RedisClientOptions<M, S>['scripts']
  socket?: RedisClientOptions<M, S>['socket']
  url?: RedisClientOptions<M, S>['url']
  username?: RedisClientOptions<M, S>['username']
}

export default RedisModuleOptions
