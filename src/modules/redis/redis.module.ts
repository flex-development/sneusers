import { OrPromise } from '@flex-development/tutils'
import {
  DynamicModule,
  FactoryProvider,
  Module,
  Provider,
  ValueProvider
} from '@nestjs/common'
import type { RedisScripts } from 'redis'
import { createClient } from 'redis'
import { RedisModuleOptions, RedisModuleOptionsAsync } from './abstracts'
import { RedisOptionsFactory } from './factories'
import { RedisCacheStore, RedisStore } from './providers'
import { REDIS_CLIENT } from './redis.constants'
import { RedisClient } from './types'

/**
 * @file RedisModule
 * @module sneusers/modules/redis/RedisModule
 */

@Module({})
export default class RedisModule {
  /**
   * Creates a {@link RedisClient} provider.
   *
   * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
   *
   * @template S - [Lua Scripts][1]
   *
   * @private
   * @static
   * @param {RedisModuleOptions<S>} options - Module options
   * @return {ValueProvider<RedisClient<S>>} - Value provider
   */
  private static createClient<S extends RedisScripts = RedisScripts>(
    options: RedisModuleOptions<S>
  ): ValueProvider<RedisClient<S>> {
    return { provide: REDIS_CLIENT, useValue: createClient<S>(options) }
  }

  /**
   * Creates an asynchronous {@link RedisClient} provider.
   *
   * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
   *
   * @template S - [Lua Scripts][1]
   *
   * @private
   * @static
   * @return {FactoryProvider<RedisClient<S>>} - Factory provider
   */
  private static createClientAsync<
    S extends RedisScripts = RedisScripts
  >(): FactoryProvider<RedisClient<S>> {
    return {
      inject: [RedisModuleOptions],
      provide: REDIS_CLIENT,
      useFactory(options: RedisModuleOptions<S>): RedisClient<S> {
        return createClient<S>(options)
      }
    }
  }

  /**
   * Creates a {@link RedisModuleOptions} provider.
   *
   * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
   *
   * @template S - [Lua Scripts][1]
   *
   * @private
   * @static
   * @param {RedisModuleOptions<S>} options - Module options
   * @return {ValueProvider<RedisModuleOptions<S>>} Value provider
   */
  private static createOptions<S extends RedisScripts = RedisScripts>(
    options: RedisModuleOptions<S>
  ): ValueProvider<RedisModuleOptions<S>> {
    return { provide: RedisModuleOptions, useValue: options }
  }

  /**
   * Creates an asynchronous {@link RedisModuleOptions} provider.
   *
   * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
   *
   * @template S - [Lua Scripts][1]
   *
   * @private
   * @static
   * @param {RedisModuleOptionsAsync<S>} options - Module options
   * @return {Provider<OrPromise<RedisModuleOptions<S>>>} Options provider
   */
  private static createOptionsAsync<S extends RedisScripts = RedisScripts>(
    options: RedisModuleOptionsAsync<S>
  ): Provider<OrPromise<RedisModuleOptions<S>>> {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: RedisModuleOptions,
        useFactory: options.useFactory
      }
    }

    return {
      inject: [(options.useClass || options.useExisting)!],
      provide: RedisModuleOptions,
      useFactory: async (f: RedisOptionsFactory<S>) => f.createRedisOptions()
    }
  }

  /**
   * Configures the module statically.
   *
   * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
   *
   * @template S - [Lua Scripts][1]
   *
   * @static
   * @param {RedisModuleOptions<S>} options - Module options
   * @return {DynamicModule} Configured module
   */
  static register<S extends RedisScripts = RedisScripts>(
    options: RedisModuleOptions<S>
  ): DynamicModule {
    return {
      exports: [REDIS_CLIENT, RedisCacheStore, RedisStore, RedisModuleOptions],
      module: RedisModule,
      providers: [
        RedisCacheStore,
        RedisStore,
        this.createClient(options),
        this.createOptions(options)
      ]
    }
  }

  /**
   * Configures the module dynamically.
   *
   * [1]: https://github.com/redis/node-redis/blob/master/README.md#lua-scripts
   *
   * @template S - [Lua Scripts][1]
   *
   * @static
   * @param {RedisModuleOptionsAsync<S>} options - Module options
   * @return {DynamicModule} Configured module
   */
  static registerAsync<S extends RedisScripts = RedisScripts>(
    options: RedisModuleOptionsAsync<S>
  ): DynamicModule {
    if (!options.extraProviders) options.extraProviders = []

    if (options.useClass) {
      options.extraProviders.push(options.useClass, {
        provide: RedisOptionsFactory,
        useClass: options.useClass
      })
    }

    if (options.useExisting) {
      options.extraProviders.push({
        provide: RedisOptionsFactory,
        useExisting: options.useExisting
      })
    }

    return {
      exports: [
        REDIS_CLIENT,
        RedisCacheStore,
        RedisStore,
        RedisModuleOptions,
        RedisOptionsFactory
      ],
      global: options.isGlobal,
      imports: options.imports,
      module: RedisModule,
      providers: [
        RedisCacheStore,
        RedisStore,
        this.createClientAsync<S>(),
        this.createOptionsAsync<S>(options),
        ...options.extraProviders
      ]
    }
  }
}
