import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '@sneusers/models'
import { RedisCacheOptions } from '@sneusers/modules/redis/abstracts'
import { RedisCacheStore } from '@sneusers/modules/redis/providers'

/**
 * @file Providers - CacheConfigService
 * @module sneusers/providers/CacheConfigService
 */

@Injectable()
class CacheConfigService implements CacheOptionsFactory<RedisCacheOptions> {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly store: RedisCacheStore
  ) {}

  /**
   * Get [`CacheModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/caching
   *
   * @static
   * @return {CacheModuleAsyncOptions<RedisCacheOptions>} Module options
   */
  static get moduleOptions(): CacheModuleAsyncOptions<RedisCacheOptions> {
    return { isGlobal: true, useClass: CacheConfigService }
  }

  /**
   * Get [caching][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/caching
   *
   * @async
   * @return {Promise<CacheModuleOptions<RedisCacheOptions>>} Caching options
   */
  async createCacheOptions(): Promise<CacheModuleOptions<RedisCacheOptions>> {
    if (!this.config.get<boolean>('TEST')) await this.store.client.connect()

    return {
      max: this.config.get<number>('CACHE_MAX'),
      store: this.store,
      ttl: this.config.get<number>('CACHE_TTL')
    }
  }
}

export default CacheConfigService
