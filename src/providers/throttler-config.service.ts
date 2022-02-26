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
class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Get [`ThrottlerModule`][1] configuration options.
   *
   * [1]: https://github.com/nestjs/throttler
   *
   * @static
   * @return {ThrottlerAsyncOptions} Module options
   */
  static get moduleOptions(): ThrottlerAsyncOptions {
    return { useClass: ThrottlerConfigService }
  }

  /**
   * Get [rate limiting][1] options.
   *
   * [1]: https://docs.nestjs.com/security/rate-limiting
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

export default ThrottlerConfigService
