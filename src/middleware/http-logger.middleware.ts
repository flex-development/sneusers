import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import volleyball from 'volleyball'

/**
 * @file Middleware - HttpLoggerMiddleware
 * @module sneusers/middleware/HttpLoggerMiddleware
 */

@Injectable()
class HttpLoggerMiddleware implements NestMiddleware {
  /**
   * @static
   * @readonly
   * @property {string} DEBUG_NAMESPACE - Debugger namespace
   */
  static readonly DEBUG_NAMESPACE: string = 'http'

  /**
   * Logs incoming requests and outgoing responses as separate events.
   *
   * Request-response pairs can be identified by a color-coded, 4 character id.
   *
   * @see https://github.com/glebec/volleyball
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Nothing when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const debug = require('debug')(HttpLoggerMiddleware.DEBUG_NAMESPACE)
    return volleyball.custom({ debug })(req, res, next)
  }
}

export default HttpLoggerMiddleware
