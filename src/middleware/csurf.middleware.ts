import { OrUndefined } from '@flex-development/tutils'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { ENV } from '@sneusers/config/configuration'
import csurf, { CookieOptions } from 'csurf'
import { NextFunction, Request, Response } from 'express'

/**
 * @file Middleware - CsurfMiddleware
 * @module sneusers/middleware/CsurfMiddleware
 * @see https://github.com/expressjs/csurf
 */

@Injectable()
export default class CsurfMiddleware implements NestMiddleware {
  /**
   * @static
   * @readonly
   * @property {CsurfOptions} options - `csurf` options
   */
  static readonly options: CsurfOptions

  /**
   * Sets configuration options.
   *
   * @see https://github.com/expressjs/csurf#options
   *
   * @param {CsurfOptions} [options={}] - Configuration options
   * @return {typeof CsurfMiddleware} Updated middleware class
   */
  static configure(options: CsurfOptions = {}): typeof CsurfMiddleware {
    return Object.assign(this, {
      options: { ...options, cookie: CsurfMiddleware.cookie(options.cookie) }
    })
  }

  /**
   * Merge instance cookie options with default cookie options.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @param {CookieOptions | boolean} [cookie=true] - csurf cookie options
   * @return {CookieOptions} Merged options
   */
  static cookie(cookie: CsurfOptions['cookie'] = true): CookieOptions {
    const COOKIE_DEFAULTS: CookieOptions = {
      domain: ENV.HOST,
      expires: new Date(Date.now() + ENV.JWT_EXP_ACCESS),
      httpOnly: true,
      sameSite: 'strict',
      secure: ENV.PROD
    }

    if (typeof cookie === 'object') return { ...COOKIE_DEFAULTS, ...cookie }
    return COOKIE_DEFAULTS
  }

  /**
   * Extracts a csurf token from an incoming request header.
   *
   * @param {Request} req - Incoming request
   * @return {OrUndefined<string>} Extracted token
   */
  static extract(req: Request): OrUndefined<string> {
    const route = ENV.TEST ? req.path : req.baseUrl

    const csrf_token = req.headers['csrf-token'] as OrUndefined<string>
    const xsrf_token = req.headers['xsrf-token'] as OrUndefined<string>
    const x_csrf_token = req.headers['x-csrf-token'] as OrUndefined<string>
    const x_xsrf_token = req.headers['x-xsrf-token'] as OrUndefined<string>

    const token = csrf_token || xsrf_token || x_csrf_token || x_xsrf_token

    if (CsurfMiddleware.options.ignoreRoutes) {
      const routes = CsurfMiddleware.options.ignoreRoutes
      const array = Array.isArray(CsurfMiddleware.options.ignoreRoutes)

      const array_ignore = array && (routes as string[]).includes(route)
      const regex_ignore = !array && (routes as RegExp).test(route)

      if (array_ignore || regex_ignore) return token || req.csrfToken()
    }

    return token
  }

  /**
   * Enables [`csurf`][1].
   *
   * [1]: https://github.com/expressjs/csurf
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Nothing when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    return csurf({
      ...CsurfMiddleware.options,
      value: CsurfMiddleware.extract as () => string
    })(req, res, next)
  }
}

export type CsurfOptions = {
  cookie?: CookieOptions | boolean
  ignoreMethods?: string[]
  ignoreRoutes?: RegExp | string[]
}
