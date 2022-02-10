import { Injectable } from '@nestjs/common'
import { HelmetOptionsFactory } from '@sneusers/factories'
import { HelmetOptions } from 'helmet'

/**
 * @file Providers - HelmetConfigService
 * @module sneusers/providers/HelmetConfigService
 */

@Injectable()
export default class HelmetConfigService implements HelmetOptionsFactory {
  /**
   * Get [`helmet`][1] options.
   *
   * [1]: https://github.com/helmetjs/helmet
   *
   * @return {HelmetOptions} `helmet` options
   */
  createHelmetOptions(): HelmetOptions {
    return {
      hsts: false
    }
  }

  /**
   * Returns the [`helmet`][1] middleware routing configuration.
   *
   * [1]: https://github.com/helmetjs/helmet
   *
   * @see https://docs.nestjs.com/middleware
   *
   * @return {string[]} Routing configuration
   */
  createHelmetRoutes(): string[] {
    return ['*']
  }
}
