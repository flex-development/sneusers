import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Providers - CacheConfigService
 * @module sneusers/providers/CacheConfigService
 */

@Injectable()
export default class CacheConfigService implements CacheOptionsFactory {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Returns the application [`CacheModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/caching
   * [2]: https://docs.nestjs.com/techniques/caching#async-configuration
   *
   * @static
   * @return {CacheModuleAsyncOptions} [`CacheModule#registerAsync`][2] options
   */
  static get moduleOptions(): CacheModuleAsyncOptions {
    return { isGlobal: true, useClass: CacheConfigService }
  }

  /**
   * Returns the application [caching configuration][1].
   *
   * [1]: https://docs.nestjs.com/techniques/caching#customize-caching
   *
   * @return {CacheModuleOptions} Caching configuration options
   */
  createCacheOptions(): CacheModuleOptions {
    return {
      max: this.config.get<number>('CACHE_MAX'),
      ttl: this.config.get<number>('CACHE_TTL')
    }
  }
}
