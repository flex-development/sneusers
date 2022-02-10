import { OrUndefined } from '@flex-development/tutils'
import { Injectable, NestMiddleware, Optional } from '@nestjs/common'
import { CsurfOptionsFactory } from '@sneusers/factories'
import { CsurfOptions } from '@sneusers/interfaces'
import csurf from 'csurf'
import { NextFunction, Request, Response } from 'express'

/**
 * @file Middleware - CsurfMiddleware
 * @module sneusers/middleware/CsurfMiddleware
 * @see https://github.com/expressjs/csurf
 */

@Injectable()
export default class CsurfMiddleware implements NestMiddleware {
  constructor(@Optional() protected readonly factory?: CsurfOptionsFactory) {}

  /**
   * Extracts a csurf token from an incoming request header.
   *
   * @param {Request} req - Incoming request
   * @param {CsurfOptions} [options={}] - Middleware options
   * @return {OrUndefined<string>} Extracted token
   */
  extract(req: Request, options: CsurfOptions = {}): OrUndefined<string> {
    const csrf_token = req.headers['csrf-token'] as OrUndefined<string>
    const xsrf_token = req.headers['xsrf-token'] as OrUndefined<string>
    const x_csrf_token = req.headers['x-csrf-token'] as OrUndefined<string>
    const x_xsrf_token = req.headers['x-xsrf-token'] as OrUndefined<string>

    const token = csrf_token || xsrf_token || x_csrf_token || x_xsrf_token

    if (options.ignoreRoutes) {
      const route = req.originalUrl
      const routes = options.ignoreRoutes
      const array = Array.isArray(routes)

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
   * @return {void} Empty promise when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const options = this.factory?.createCsurfOptions() ?? {}

    const extract = (req: Request) => this.extract(req, options)
    const value = (options.value || extract) as () => string

    return csurf({ ...options, value })(req, res, next)
  }
}
