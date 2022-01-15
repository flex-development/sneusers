import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import helmet, { HelmetOptions } from 'helmet'

/**
 * @file Middleware - HelmetMiddleware
 * @module sneusers/middleware/HelmetMiddleware
 * @see https://github.com/helmetjs/helmet
 */

@Injectable()
export default class HelmetMiddleware implements NestMiddleware {
  /**
   * @static
   * @readonly
   * @property {HelmetOptions} options - `helmet` options
   */
  static readonly options: HelmetOptions = {}

  /**
   * Sets configuration options.
   *
   * @see https://github.com/helmetjs/helmet#reference
   *
   * @param {HelmetOptions} [options={}] - Configuration options
   * @return {typeof HelmetMiddleware} Updated middleware class
   */
  static configure(options: HelmetOptions = {}): typeof HelmetMiddleware {
    return Object.assign(this, { options })
  }

  /**
   * Enables [`helmet`][1].
   *
   * [1]: https://github.com/helmetjs/helmet
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Nothing when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    return helmet(HelmetMiddleware.options)(req, res, next)
  }
}
