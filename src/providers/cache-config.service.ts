import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '@sneusers/models'
import RedisCacheStore from 'cache-manager-redis-store'
import type { ClientOpts as RedisClientOpts } from 'redis'

/**
 * @file Providers - CacheConfigService
 * @module sneusers/providers/CacheConfigService
 */

@Injectable()
export default class CacheConfigService
  implements CacheOptionsFactory<RedisClientOpts>
{
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Returns the application [`CacheModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/caching
   * [2]: https://docs.nestjs.com/techniques/caching#async-configuration
   *
   * @static
   * @return {CacheModuleAsyncOptions<RedisClientOpts>} Module config options
   */
  static get moduleOptions(): CacheModuleAsyncOptions<RedisClientOpts> {
    return { isGlobal: true, useClass: CacheConfigService }
  }

  /**
   * Returns the application [caching configuration][1].
   *
   * [1]: https://docs.nestjs.com/techniques/caching#customize-caching
   *
   * @return {CacheModuleOptions<RedisClientOpts>} Caching configuration options
   */
  createCacheOptions(): CacheModuleOptions<RedisClientOpts> {
    return {
      host: this.config.get<string>('REDIS_HOST'),
      max: this.config.get<number>('CACHE_MAX'),
      port: this.config.get<number>('REDIS_PORT'),
      store: this.config.get<boolean>('TEST') ? 'memory' : RedisCacheStore,
      ttl: this.config.get<number>('CACHE_TTL')
    }
  }
}
