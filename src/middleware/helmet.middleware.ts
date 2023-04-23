/**
 * @file Middleware - HelmetMiddleware
 * @module sneusers/middleware/Helmet
 */

import { HELMET_OPTIONS } from '#src/tokens'
import {
  Inject,
  Injectable,
  Optional,
  type NestMiddleware
} from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import helmet, { type HelmetOptions } from 'helmet'

/**
 * `helmet` middleware provider.
 *
 * @see https://github.com/helmetjs/helmet
 *
 * @class
 * @implements {NestMiddleware}
 */
@Injectable()
class HelmetMiddleware implements NestMiddleware {
  /**
   * Creates a new {@linkcode helmet} middleware provider.
   *
   * @see {@linkcode HelmetOptions}
   *
   * @param {HelmetOptions} [options] - `helmet` options
   */
  constructor(
    @Optional()
    @Inject(HELMET_OPTIONS)
    private readonly options?: HelmetOptions
  ) {}

  /**
   * Configures [`helmet`][1] using the given {@linkcode options}.
   *
   * [1]: https://github.com/helmetjs/helmet
   *
   * @public
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Nothing when complete
   */
  public use(req: Request, res: Response, next: NextFunction): void {
    return void helmet(this.options)(req, res, next)
  }
}

export default HelmetMiddleware
