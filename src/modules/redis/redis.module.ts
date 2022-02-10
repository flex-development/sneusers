import { OrPromise } from '@flex-development/tutils'
import {
  DynamicModule,
  FactoryProvider,
  Module,
  Provider,
  ValueProvider
} from '@nestjs/common'
import { REDIS_MODULE_OPTIONS } from '@sneusers/modules/redis/redis.constants'
import { createClient } from 'redis'
import { RedisClient } from './abstracts'
import { RedisOptionsFactory } from './factories'
import { RedisModuleOptions, RedisModuleOptionsAsync } from './interfaces'

/**
 * @file RedisModule
 * @module sneusers/modules/redis/RedisModule
 */

@Module({})
export default class RedisModule {
  /**
   * Creates a {@link RedisClient} provider.
   *
   * @param {RedisModuleOptions} options - `RedisModule` options
   * @return {ValueProvider<RedisClient>} - Factory provider
   */
  private static createClient(
    options: RedisModuleOptions
  ): ValueProvider<RedisClient> {
    return { provide: RedisClient, useValue: createClient(options) }
  }

  /**
   * Creates an asynchronous {@link RedisClient} provider.
   *
   * @param {RedisModuleOptionsAsync} options - Async module options
   * @return {FactoryProvider<RedisClient>} - Factory provider
   */
  private static createClientAsync(
    options: RedisModuleOptionsAsync
  ): FactoryProvider<RedisClient> {
    return {
      inject: [REDIS_MODULE_OPTIONS],
      provide: RedisClient,
      useFactory(opts: RedisModuleOptions): RedisClient {
        return options.skipClient ? ({} as RedisClient) : createClient(opts)
      }
    }
  }

  /**
   * Creates a {@link RedisModuleOptions} provider.
   *
   * @private
   * @static
   * @param {RedisModuleOptions} options - Module options
   * @return {ValueProvider<RedisModuleOptions>} Value provider
   */
  private static createOptions(
    options: RedisModuleOptions
  ): ValueProvider<RedisModuleOptions> {
    return { provide: REDIS_MODULE_OPTIONS, useValue: options }
  }

  /**
   * Creates an asynchronous {@link RedisModuleOptions} provider.
   *
   * @private
   * @static
   * @param {RedisModuleOptionsAsync} options - Async module options
   * @return {Provider<OrPromise<RedisModuleOptions>>} Options provider
   */
  private static createOptionsAsync(
    options: RedisModuleOptionsAsync
  ): Provider<OrPromise<RedisModuleOptions>> {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: REDIS_MODULE_OPTIONS,
        useFactory: options.useFactory
      }
    }

    return {
      inject: [(options.useClass || options.useExisting)!],
      provide: REDIS_MODULE_OPTIONS,
      useFactory: async (f: RedisOptionsFactory) => f.createRedisOptions()
    }
  }

  /**
   * Configure the module statically.
   *
   * @static
   * @param {RedisModuleOptions} options - Module options
   * @return {DynamicModule} Configured module
   */
  static register(options: RedisModuleOptions): DynamicModule {
    return {
      exports: [RedisClient],
      module: RedisModule,
      providers: [this.createClient(options), this.createOptions(options)]
    }
  }

  /**
   * Configure the module dynamically.
   *
   * @static
   * @param {RedisModuleOptionsAsync} options - Async module options
   * @return {DynamicModule} Configured module
   */
  static registerAsync(options: RedisModuleOptionsAsync): DynamicModule {
    if (!options.extraProviders) options.extraProviders = []

    if (options.useClass) options.extraProviders.push(options.useClass)

    return {
      exports: [RedisClient],
      global: options.isGlobal,
      imports: options.imports,
      module: RedisModule,
      providers: [
        this.createClientAsync(options),
        this.createOptionsAsync(options),
        ...options.extraProviders
      ]
    }
  }
}
