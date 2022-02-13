import type {
  RedisClientOptions as IRedisClientOptions,
  RedisScripts
} from 'redis'

/**
 * @file RedisModule Abstracts - RedisClientOptions
 * @module sneusers/modules/redis/abstracts/RedisClientOptions
 */

/**
 * `RedisModule` options.
 *
 * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
 *
 * @template S - [Lua Scripts][1]
 *
 * @abstract
 * @implements {Omit<IRedisClientOptions<never, S>, 'modules'>}
 */
abstract class RedisClientOptions<S extends RedisScripts = RedisScripts>
  implements Omit<IRedisClientOptions<never, S>, 'modules'>
{
  commandsQueueMaxLength?: IRedisClientOptions<
    never,
    S
  >['commandsQueueMaxLength']
  database?: IRedisClientOptions<never, S>['database']
  isolationPoolOptions?: IRedisClientOptions<never, S>['isolationPoolOptions']
  legacyMode?: IRedisClientOptions<never, S>['legacyMode']
  name?: IRedisClientOptions<never, S>['name']
  password?: IRedisClientOptions<never, S>['password']
  readonly?: IRedisClientOptions<never, S>['readonly']
  scripts?: IRedisClientOptions<never, S>['scripts']
  socket?: IRedisClientOptions<never, S>['socket']
  url?: IRedisClientOptions<never, S>['url']
  username?: IRedisClientOptions<never, S>['username']
}

export default RedisClientOptions
