import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '@sneusers/models'
import { RedisClientOpts } from '@sneusers/modules/redis/interfaces'
import RedisCacheStore from 'cache-manager-redis-store'
import RedisConfigService from './redis-config.service'

/**
 * @file Providers - CacheConfigService
 * @module sneusers/providers/CacheConfigService
 */

@Injectable()
export default class CacheConfigService
  implements CacheOptionsFactory<RedisClientOpts>
{
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly redis: RedisConfigService
  ) {}

  /**
   * Get `CacheModule` configuration options.
   *
   * @static
   * @return {CacheModuleAsyncOptions<RedisClientOpts>} Module options
   */
  static get moduleOptions(): CacheModuleAsyncOptions<RedisClientOpts> {
    return {
      extraProviders: [RedisConfigService],
      isGlobal: true,
      useClass: CacheConfigService
    }
  }

  /**
   * Get caching configuration options.
   *
   * @return {CacheModuleOptions<RedisClientOpts>} Caching configuration options
   */
  createCacheOptions(): CacheModuleOptions<RedisClientOpts> {
    return {
      ...this.redis.createRedisOptions(),
      max: this.config.get<number>('CACHE_MAX'),
      store: this.config.get<boolean>('TEST') ? 'memory' : RedisCacheStore,
      ttl: this.config.get<number>('CACHE_TTL')
    }
  }
}
