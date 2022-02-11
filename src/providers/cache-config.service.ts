import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '@sneusers/models'
import RedisCacheStore from 'cache-manager-redis-store'
import { RedisClientOptions } from 'redis'
import RedisConfigService from './redis-config.service'

/**
 * @file Providers - CacheConfigService
 * @module sneusers/providers/CacheConfigService
 */

@Injectable()
export default class CacheConfigService
  implements CacheOptionsFactory<RedisClientOptions>
{
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly redis: RedisConfigService
  ) {}

  /**
   * Get [`CacheModule`] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/caching
   *
   * @static
   * @return {CacheModuleAsyncOptions<RedisClientOptions>} Module options
   */
  static get moduleOptions(): CacheModuleAsyncOptions<RedisClientOptions> {
    return {
      extraProviders: [RedisConfigService],
      isGlobal: true,
      useClass: CacheConfigService
    }
  }

  /**
   * Get [caching][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/caching
   *
   * @return {CacheModuleOptions<RedisClientOptions>} Caching options
   */
  createCacheOptions(): CacheModuleOptions<RedisClientOptions> {
    return {
      ...this.redis.createRedisOptions(),
      max: this.config.get<number>('CACHE_MAX'),
      store: this.config.get<boolean>('TEST') ? 'memory' : RedisCacheStore,
      ttl: this.config.get<number>('CACHE_TTL')
    }
  }
}
