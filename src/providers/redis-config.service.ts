import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV } from '@sneusers/config/configuration'
import type { EnvironmentVariables } from '@sneusers/models'
import { RedisOptionsFactory } from '@sneusers/modules/redis/factories'
import {
  RedisClientOpts,
  RedisModuleOptionsAsync
} from '@sneusers/modules/redis/interfaces'

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
   * Get Redis client configuration options.
   *
   * @return {RedisClientOpts} Client configuration options
   */
  createRedisOptions(): RedisClientOpts {
    return {
      host: this.config.get<string>('REDIS_HOST'),
      password: this.config.get<string>('REDIS_PASSWORD'),
      port: this.config.get<number>('REDIS_PORT')
    }
  }
}
