import { ClassProvider, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '@sneusers/models'
import { CookieOptions, CookieParseOptions } from '../abstracts'
import { CookieType, SameSitePolicy } from '../enums'
import { CookieOptionsFactory } from '../factories'

/**
 * @file MiddlewareModule Providers - CookieConfigService
 * @module sneusers/modules/middleware/providers/CookieConfigService
 */

@Injectable()
class CookieConfigService implements CookieOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Creates a {@link CookieOptionsFactory} provider.
   *
   * @static
   * @return {ClassProvider<CookieOptionsFactory>} Class provider
   */
  static createProvider(): ClassProvider<CookieOptionsFactory> {
    return { provide: CookieOptionsFactory, useClass: CookieConfigService }
  }

  /**
   * Get cookie options.
   *
   * @see https://github.com/expressjs/csurf#cookie
   * @see https://github.com/expressjs/session#cookie
   *
   * @param {CookieType} [type] - Cookie type
   * @return {CookieOptions} Cookie options
   */
  createOptions(type?: CookieType): CookieOptions {
    let options: CookieOptions = { domain: this.config.get<string>('HOSTNAME') }

    if (type === CookieType.CSRF) {
      options = {
        ...options,
        httpOnly: this.config.get<boolean>('CSURF_COOKIE_HTTP_ONLY'),
        key: this.config.get<string>('CSURF_COOKIE_KEY'),
        maxAge: this.config.get<number>('CSURF_COOKIE_MAX_AGE'),
        path: this.config.get<string>('CSURF_COOKIE_PATH'),
        sameSite: this.config.get<SameSitePolicy>('CSURF_COOKIE_SAME_SITE'),
        secure: this.config.get<boolean>('CSURF_COOKIE_SECURE'),
        signed: this.config.get<boolean>('CSURF_COOKIE_SIGNED')
      }
    }

    if (type === CookieType.LOGOUT || type === CookieType.REFRESH) {
      const logout = type === CookieType.LOGOUT

      options = {
        ...options,
        httpOnly: true,
        maxAge: logout ? 0 : this.config.get<number>('JWT_EXP_REFRESH'),
        path: '/refresh',
        sameSite: logout ? undefined : SameSitePolicy.STRICT,
        secure: this.config.get<boolean>('PROD')
      }
    }

    if (type === CookieType.SESSION) {
      options = {
        ...options,
        httpOnly: this.config.get<boolean>('SESSION_COOKIE_HTTP_ONLY'),
        maxAge: this.config.get<number>('SESSION_COOKIE_MAX_AGE'),
        path: this.config.get<string>('SESSION_COOKIE_PATH'),
        sameSite: this.config.get<SameSitePolicy>('SESSION_COOKIE_SAME_SITE'),
        secure: this.config.get<boolean>('SESSION_COOKIE_SECURE')
      }
    }

    return options
  }

  /**
   * Get [`cookie-parser`][1] options.
   *
   * [1]: https://github.com/expressjs/cookie-parser
   *
   * @return {CookieParseOptions} `cookie-parser` options
   */
  createParserOptions(): CookieParseOptions {
    return {
      secret: this.config.get<string>('COOKIE_SECRET')
    }
  }

  /**
   * Returns the [`cookie-parser`][1] middleware routing configuration.
   *
   * [1]: https://github.com/expressjs/cookie-parser
   *
   * @see https://docs.nestjs.com/middleware
   *
   * @return {string[]} Routing configuration
   */
  createParserRoutes(): string[] {
    return ['*']
  }
}

export default CookieConfigService
