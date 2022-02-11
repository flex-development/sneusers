import { Injectable, NestMiddleware, Optional } from '@nestjs/common'
import { CookieOptionsFactory } from '@sneusers/modules/middleware/factories'
import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from 'express'

/**
 * @file Middleware - CookieParserMiddleware
 * @module sneusers/middleware/CookieParserMiddleware
 */

@Injectable()
class CookieParserMiddleware implements NestMiddleware {
  constructor(@Optional() protected readonly factory?: CookieOptionsFactory) {}

  /**
   * Enables [`cookie-parser`][1].
   *
   * [1]: https://github.com/expressjs/cookie-parser
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Empty promise when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const options = this.factory?.createParserOptions() ?? {}
    return cookieParser(options.secret, options)(req, res, next)
  }
}

export default CookieParserMiddleware
