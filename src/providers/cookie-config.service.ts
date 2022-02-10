import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieType } from '@sneusers/enums'
import CookieOptionsFactory from '@sneusers/factories/cookie-options.factory'
import { CookieParserOptions } from '@sneusers/interfaces'
import type { EnvironmentVariables } from '@sneusers/models'
import { CookieOptions as CsurfCookieOptions } from 'csurf'
import { CookieOptions } from 'express'

/**
 * @file Providers - CookieConfigService
 * @module sneusers/providers/CookieConfigService
 */

@Injectable()
export default class CookieConfigService implements CookieOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Get cookie options.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @param {CookieType} [type] - Cookie type
   * @return {CookieOptions | CsurfCookieOptions} Cookie options
   */
  createOptions(type?: CookieType): CookieOptions | CsurfCookieOptions {
    const options: CookieOptions = {
      domain: this.config.get<string>('HOSTNAME'),
      httpOnly: true,
      sameSite: 'strict',
      secure: this.config.get<boolean>('PROD')
    }

    if (type === CookieType.CSRF) {
      return {
        ...options,
        key: '_csrf',
        maxAge: this.config.get<number>('CSURF_COOKIE_MAX_AGE')
      }
    }

    if (type === CookieType.LOGOUT || type === CookieType.REFRESH) {
      const logout = type === CookieType.LOGOUT

      return {
        ...options,
        maxAge: logout ? 0 : this.config.get<number>('JWT_EXP_REFRESH'),
        path: '/refresh',
        sameSite: logout ? undefined : options.sameSite
      }
    }

    return options
  }

  /**
   * Get [`cookie-parser`][1] options.
   *
   * [1]: https://github.com/expressjs/cookie-parser
   *
   * @return {CookieParserOptions} `cookie-parser` options
   */
  createParserOptions(): CookieParserOptions {
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
