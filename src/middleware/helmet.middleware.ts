import { Injectable, NestMiddleware, Optional } from '@nestjs/common'
import { HelmetOptionsFactory } from '@sneusers/modules/middleware/factories'
import { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'

/**
 * @file Middleware - HelmetMiddleware
 * @module sneusers/middleware/HelmetMiddleware
 */

@Injectable()
class HelmetMiddleware implements NestMiddleware {
  constructor(@Optional() protected readonly factory?: HelmetOptionsFactory) {}

  /**
   * Enables [`helmet`][1].
   *
   * [1]: https://github.com/helmetjs/helmet
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Empty promise when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    return helmet(this.factory?.createHelmetOptions())(req, res, next)
  }
}

export default HelmetMiddleware
