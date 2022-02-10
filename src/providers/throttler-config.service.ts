import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { ThrottlerOptionsFactory } from '@nestjs/throttler'
import {
  ThrottlerAsyncOptions,
  ThrottlerModuleOptions
} from '@nestjs/throttler'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Providers - ThrottlerConfigService
 * @module sneusers/providers/ThrottlerConfigService
 */

@Injectable()
export default class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Get `ThrottlerModule` configuration options.
   *
   * @static
   * @return {ThrottlerAsyncOptions} Module options
   */
  static get moduleOptions(): ThrottlerAsyncOptions {
    return { useClass: ThrottlerConfigService }
  }

  /**
   * Get rate limiting options.
   *
   * @return {ThrottlerModuleOptions} Rate limiting configuration options
   */
  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      limit: this.config.get<number>('THROTTLE_LIMIT'),
      ttl: this.config.get<number>('THROTTLE_TTL')
    }
  }
}
