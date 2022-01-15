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
   * Returns the application [`ThrottlerModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/security/rate-limiting
   * [2]: https://docs.nestjs.com/security/rate-limiting#async-configuration
   *
   * @static
   * @return {ThrottlerAsyncOptions} [`ThrottlerModule.forRootAsync`][2] options
   */
  static get moduleOptions(): ThrottlerAsyncOptions {
    return { useClass: ThrottlerConfigService }
  }

  /**
   * Returns the application [rate limiting configuration][1].
   *
   * [1]: https://docs.nestjs.com/security/rate-limiting#configuration
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
