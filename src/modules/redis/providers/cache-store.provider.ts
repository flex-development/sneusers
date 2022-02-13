import { NullishString, OrNull, OrUndefined } from '@flex-development/tutils'
import { CacheStore, CacheStoreSetOptions, Injectable } from '@nestjs/common'
import { ClientCommandOptions } from '@node-redis/client/dist/lib/client'
import { CommandOptions } from '@node-redis/client/dist/lib/command-options'
import { Store } from 'cache-manager'
import { RedisClient } from '../types'
import RedisStore from './store.provider'

/**
 * @file RedisModule Providers - RedisCacheStore
 * @module sneusers/modules/redis/providers/RedisCacheStore
 */

@Injectable()
class RedisCacheStore implements Store, CacheStore {
  constructor(protected readonly store: RedisStore) {}

  /**
   * Destroy a key/value pair from the cache.
   *
   * @see https://redis.io/commands/del
   *
   * @async
   * @param {string} key - Cache key
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<number>} Promise containing number of keys removed
   */
  async del(
    key: string,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<void> {
    await this.store.del([key], redis)
  }

  /**
   * Retrieve a key/value pair from the cache.
   *
   * @see https://redis.io/commands/get
   *
   * @template T - Value type
   *
   * @async
   * @param {string} key - Cache key
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<OrUndefined<T>>} Promise containing cached value
   */
  async get<T>(
    key: string,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<OrUndefined<T>> {
    const value = await this.store.get<T>(key, redis)
    return value === null ? undefined : value
  }

  /**
   * Returns all keys matching `pattern`.
   *
   * @see https://redis.io/commands/keys
   *
   * @async
   * @param {string} [pattern='*'] - Key filter pattern
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<string[]>} Promise containing keys matching `pattern`
   */
  async keys(
    pattern: string = '*',
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<string[]> {
    return this.store.keys(pattern, redis)
  }

  /**
   * Returns the values of all specified `keys`.
   *
   * @see https://redis.io/commands/mget
   *
   * @template T - Return data type
   *
   * @async
   * @param {string[]} keys - Keys to retrieve
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<OrNull<T>[]>} Promise containing requested values
   */
  async mget<T>(
    keys: string[],
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<OrNull<T>[]> {
    return this.store.mget<T>(keys, redis)
  }

  /**
   * Sets the given keys to their respective values.
   *
   * [1]: https://redis.io/commands/mset
   *
   * @see https://redis.io/commands/mset
   *
   * @template T - Value type
   *
   * @async
   * @param {T} pairs - Key/value pairs to cache
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<string | Buffer>} Promise containing [`MSET`][1] response
   */
  async mset<T>(
    pairs: T,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<string | Buffer> {
    return this.store.mset<T>(pairs, redis)
  }

  /**
   * Create a key/value pair in the cache.
   *
   * @see {@link CacheStoreSetOptions}
   *
   * @template T - Value type
   *
   * @async
   * @param {string} key - Cache key
   * @param {T} value - Value to cache
   * @param {CacheStoreSetOptions<T>} [options={}] - `CacheStoreSetOptions`
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<void>} Empty promise when complete
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheStoreSetOptions<T> = {},
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<void> {
    if (options.ttl) {
      await this.setex<T>(
        key,
        typeof options.ttl === 'function' ? options.ttl(value) : options.ttl,
        value,
        redis
      )
    }

    await this.store.set<T>(key, value, {}, redis)
  }

  /**
   * Set `key` to hold `value` and to timeout after a given number of seconds.
   *
   * [1]: https://redis.io/commands/setex
   *
   * @see https://redis.io/commands/setex
   *
   * @template T - Value type
   *
   * @async
   * @param {string} key - Cache key
   * @param {number} seconds - `key` timeout
   * @param {T} value - Value to cache
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<NullishString>} Promise containing [`SETEX`][1] response
   */
  async setex<T>(
    key: string,
    seconds: number,
    value: T,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<NullishString> {
    return this.store.setex<T>(key, seconds, value, redis)
  }

  /**
   * Returns the remaining time to live of a key that has a timeout.
   *
   * @see https://redis.io/commands/ttl
   *
   * @async
   * @param {string} key - Cache key
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<number>} Promise containing remaining ttl
   */
  async ttl(
    key: string,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<number> {
    return this.store.ttl(key, redis)
  }

  /**
   * Get the {@link store} Redis client.
   *
   * @return {RedisClient} Store redis client
   */
  get client(): RedisClient {
    return this.store.client
  }

  /**
   * Checks if the {@link store} is connected to Redis.
   *
   * @return {boolean} `true` if connected, `false` otherwise
   */
  get connected(): boolean {
    return this.store.connected
  }
}

export default RedisCacheStore
