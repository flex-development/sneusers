import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV } from '@sneusers/config/configuration'
import type { EnvironmentVariables } from '@sneusers/models'
import { RedisModuleOptionsAsync } from '@sneusers/modules/redis/abstracts'
import { RedisOptionsFactory } from '@sneusers/modules/redis/factories'
import { RedisClientOptions } from 'redis'

/**
 * @file Providers - RedisConfigService
 * @module sneusers/providers/RedisConfigService
 */

@Injectable()
export default class RedisConfigService implements RedisOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Get `RedisModule` configuration options.
   *
   * @static
   * @return {RedisModuleOptionsAsync} Module options
   */
  static get moduleOptions(): RedisModuleOptionsAsync {
    return {
      isGlobal: true,
      skipClient: ENV.TEST,
      useClass: RedisConfigService
    }
  }

  /**
   * Get [Redis client][1] configuration options.
   *
   * [1]: https://github.com/redis/node-redis
   *
   * @return {RedisClientOptions} Client configuration options
   */
  createRedisOptions(): RedisClientOptions {
    return {
      password: this.config.get<string>('REDIS_PASSWORD'),
      socket: {
        host: this.config.get<string>('REDIS_HOST'),
        port: this.config.get<number>('REDIS_PORT')
      },
      username: this.config.get<string>('REDIS_USER')
    }
  }
}
