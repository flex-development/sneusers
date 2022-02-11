import { ClassProvider, Injectable } from '@nestjs/common'
import { HelmetOptions } from '../abstracts'
import { HelmetOptionsFactory } from '../factories'

/**
 * @file MiddlewareModule Providers - HelmetConfigService
 * @module sneusers/modules/middleware/providers/HelmetConfigService
 */

@Injectable()
class HelmetConfigService implements HelmetOptionsFactory {
  /**
   * Creates a {@link HelmetOptionsFactory} provider.
   *
   * @static
   * @return {ClassProvider<HelmetOptionsFactory>} Class provider
   */
  static createProvider(): ClassProvider<HelmetOptionsFactory> {
    return { provide: HelmetOptionsFactory, useClass: HelmetConfigService }
  }

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

export default HelmetConfigService
