import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieType } from '@sneusers/enums'
import CookieOptionsFactory from '@sneusers/factories/cookie-options.factory'
import CsurfOptionsFactory from '@sneusers/factories/csurf-options.factory'
import { CsurfOptions } from '@sneusers/interfaces'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Providers - CsurfConfigService
 * @module sneusers/providers/CsurfConfigService
 */

@Injectable()
export default class CsurfConfigService implements CsurfOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly cookie: CookieOptionsFactory
  ) {}

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
