import type { OneOrMany, OrUndefined } from '@flex-development/tutils'
import { Injectable, NestMiddleware } from '@nestjs/common'
import type { CookieParseOptions } from 'cookie-parser'
import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from 'express'
import isPlainObject from 'lodash.isplainobject'

/**
 * @file Middleware - CookieParserMiddleware
 * @module sneusers/middleware/CookieParserMiddleware
 * @see https://github.com/expressjs/cookie-parser
 */

@Injectable()
export default class CookieParserMiddleware implements NestMiddleware {
  /**
   * @static
   * @readonly
   * @property {CookieParseOptions} options - Parsing options
   */
  static readonly options: CookieParseOptions = {}

  /**
   * @static
   * @readonly
   * @property {CookieParserSecret} secret - String or array for signing cookies
   */
  static readonly secret: CookieParserSecret = undefined

  /**
   * Sets cookie signing and parsing options.
   *
   * @see {@link CookieParserMiddleware.options}
   * @see {@link CookieParserMiddleware.secret}
   *
   * @param {CookieParserMiddlewareConfig} [config={}] - Configuration options
   * @return {void} Nothing when complete
   */
  static configure(config: CookieParserMiddlewareConfig = {}): void {
    if (isPlainObject(config.options)) {
      Object.assign(this, { options: config.options })
    }

    if (typeof config.secret === 'string' || Array.isArray(config.secret)) {
      Object.assign(this, { secret: config.secret })
    }

    return
  }

  /**
   * Parses the `Cookie` header on the on `req`.
   *
   * Cookie data will be exposed as the property `req.cookies`.
   *
   * If a {@link CookieParserMiddleware.secret}  was provided, cookie data will
   * be exposed as the property `req.signedCookies` instead.
   *
   * @see https://github.com/expressjs/cookie-parser#cookieparsersecret-options
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Nothing when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    return cookieParser(
      CookieParserMiddleware.secret,
      CookieParserMiddleware.options
    )(req, res, next)
  }
}

export type CookieParserSecret = OrUndefined<OneOrMany<string>>
export type CookieParserMiddlewareConfig = CookieParseOptions & {
  options?: CookieParseOptions
  secret?: CookieParserSecret
}
