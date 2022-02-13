import { NullishString, OneOrMany, OrNull } from '@flex-development/tutils'
import { Inject, Injectable } from '@nestjs/common'
import { ClientCommandOptions } from '@node-redis/client/dist/lib/client'
import { CommandOptions } from '@node-redis/client/dist/lib/command-options'
import { RedisCommandArgument } from '@node-redis/client/dist/lib/commands'
import { MSetArguments } from '@node-redis/client/dist/lib/commands/MSET'
import { Store } from 'cache-manager'
import isPlainObject from 'lodash.isplainobject'
import { REDIS_CLIENT } from '../redis.constants'
import { RedisClient, SetOptions } from '../types'

/**
 * @file RedisModule Providers - RedisStore
 * @module sneusers/modules/redis/providers/RedisStore
 */

@Injectable()
class RedisStore implements Store {
  constructor(@Inject(REDIS_CLIENT) protected readonly redis: RedisClient) {}

  /**
   * Creates a {@link RedisCommandArgument}.
   *
   * @static
   * @param {any} value - Value to stringify
   * @return {RedisCommandArgument} New command argument
   */
  static createCommandArgument(value?: any): RedisCommandArgument {
    if (value instanceof Buffer) return value
    return JSON.stringify(value) || '"undefined"'
  }

  /**
   * Creates a {@link RedisCommandArgument}.
   *
   * @param {any} value - Value to create command from
   * @return {RedisCommandArgument} New command argument
   */
  createCommandArgument(value?: any): RedisCommandArgument {
    return RedisStore.createCommandArgument(value)
  }

  /**
   * Removes the specified `keys`.
   *
   * @see https://redis.io/commands/del
   *
   * @async
   * @param {OneOrMany<RedisCommandArgument>} keys - Keys to remove
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<number>} Promise containing number of keys removed
   */
  async del(
    keys: OneOrMany<RedisCommandArgument>,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<number> {
    if (!this.connected) return Number.NaN
    return redis ? this.redis.DEL(redis, keys) : this.redis.DEL(keys)
  }

  /**
   * Get the value of `key`.
   *
   * @see https://redis.io/commands/get
   *
   * @template T - Return value type
   *
   * @async
   * @param {RedisCommandArgument} key - Unique id
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<OrNull<T>>} Promise containing requested value
   */
  async get<T>(
    key: RedisCommandArgument,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<OrNull<T>> {
    if (!this.connected) return null

    const value = redis
      ? await this.redis.GET(redis, key)
      : await this.redis.GET(key)

    return value === null ? null : (JSON.parse(value) as T)
  }

  /**
   * Returns all keys matching `pattern`.
   *
   * @see https://redis.io/commands/keys
   *
   * @async
   * @param {RedisCommandArgument} [pattern='*'] - Key filter pattern
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<string[]>} Promise containing keys matching `pattern`
   */
  async keys(
    pattern: RedisCommandArgument = '*',
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<string[]> {
    if (!this.connected) return []

    return redis ? this.redis.KEYS(redis, pattern) : this.redis.KEYS(pattern)
  }

  /**
   * Returns the values of all specified `keys`.
   *
   * @see https://redis.io/commands/mget
   *
   * @template T - Return data type
   *
   * @async
   * @param {RedisCommandArgument[]} keys - Keys to retrieve
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<OrNull<T>[]>} Promise containing requested values
   */
  async mget<T>(
    keys: RedisCommandArgument[],
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<OrNull<T>[]> {
    if (!this.connected) return []

    const value = redis
      ? await this.redis.MGET(redis, keys)
      : await this.redis.MGET(keys)

    return value.map(v => (v ? JSON.parse(v) : null)) as OrNull<T>[]
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
   * @param {T} args - Value(s) to store
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<string | Buffer>} Promise containing [`MSET`][1] response
   */
  async mset<T>(
    args: T,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<string | Buffer> {
    if (!this.connected) return ''

    let values: MSetArguments

    if (isPlainObject(args)) {
      for (const key of Object.keys(args)) {
        args[key] = this.createCommandArgument(args[key])
      }
    } else if (Array.isArray(args)) {
      values = args.map(arg => this.createCommandArgument(arg))
    } else values = [this.createCommandArgument(args)]

    return redis ? this.redis.MSET(redis, values!) : this.redis.MSET(values!)
  }

  /**
   * Set `key` to hold `value`.
   *
   * [1]: https://redis.io/commands/set
   *
   * @see https://redis.io/commands/set
   *
   * @template T - Value type
   *
   * @async
   * @param {RedisCommandArgument} key - Store key
   * @param {T} value - Value to store
   * @param {SetOptions} [options={}] - [`SET`][1] options
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<NullishString>} Promise containing [`SET`][1] response
   */
  async set<T = any>(
    key: RedisCommandArgument,
    value: T,
    options: SetOptions = {},
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<NullishString> {
    if (!this.connected) return null

    return redis
      ? this.redis.SET(redis, key, this.createCommandArgument(value), options)
      : this.redis.SET(key, this.createCommandArgument(value), options)
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
   * @param {RedisCommandArgument} key - Unique id
   * @param {number} seconds - `key` timeout
   * @param {T} value - Value to store
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<NullishString>} Promise containing [`SETEX`][1] response
   */
  async setex<T = any>(
    key: RedisCommandArgument,
    seconds: number,
    value: T,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<NullishString> {
    if (!this.connected) return null

    return redis
      ? this.redis.SETEX(redis, key, seconds, this.createCommandArgument(value))
      : this.redis.SETEX(key, seconds, this.createCommandArgument(value))
  }

  /**
   * Returns the remaining time to live of a key that has a timeout.
   *
   * @see https://redis.io/commands/ttl
   *
   * @async
   * @param {RedisCommandArgument} key - Key to get remaining ttl for
   * @param {CommandOptions<ClientCommandOptions>} [redis] - Redis options
   * @return {Promise<number>} Promise containing remaining ttl
   */
  async ttl(
    key: RedisCommandArgument,
    redis?: CommandOptions<ClientCommandOptions>
  ): Promise<number> {
    if (!this.connected) return Number.NaN
    return redis ? this.redis.TTL(redis, key) : this.redis.TTL(key)
  }

  /**
   * Returns the {@link redis} client.
   *
   * @return {RedisClient} Redis client
   */
  get client(): RedisClient {
    return this.redis
  }

  /**
   * Checks if the {@link redis} client is connected.
   *
   * @return {boolean} `true` if connected, `false` otherwise
   */
  get connected(): boolean {
    return this.client.isOpen
  }
}

export default RedisStore
