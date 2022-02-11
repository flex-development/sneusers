import { ClassProvider, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieType } from '@sneusers/enums'
import type { EnvironmentVariables } from '@sneusers/models'
import { CsurfOptions } from '../abstracts'
import { CookieOptionsFactory, CsurfOptionsFactory } from '../factories'

/**
 * @file MiddlewareModule Providers - CsurfConfigService
 * @module sneusers/modules/middleware/providers/CsurfConfigService
 */

@Injectable()
class CsurfConfigService implements CsurfOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly cookie: CookieOptionsFactory
  ) {}

  /**
   * Creates a {@link CsurfOptionsFactory} provider.
   *
   * @static
   * @return {ClassProvider<CsurfOptionsFactory>} Class provider
   */
  static createProvider(): ClassProvider<CsurfOptionsFactory> {
    return { provide: CsurfOptionsFactory, useClass: CsurfConfigService }
  }

  /**
   * Get [`csurf`][1] options.
   *
   * [1]: https://github.com/expressjs/csurf
   *
   * @return {CsurfOptions} `csurf` options
   */
  createCsurfOptions(): CsurfOptions {
    return {
      cookie: this.cookie.createOptions(CookieType.CSRF),
      ignoreRoutes: /auth\/(logout|register)|verify\/resend|verify/
    }
  }

  /**
   * Returns the [`csurf`][1] middleware routing configuration.
   *
   * [1]: https://github.com/expressjs/csurf
   *
   * @see https://docs.nestjs.com/middleware
   *
   * @return {string} Routing configuration
   */
  createCsurfRoutes(): string[] {
    return ['/auth*', '/verify*']
  }
}

export default CsurfConfigService
