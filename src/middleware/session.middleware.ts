import { Injectable, NestMiddleware } from '@nestjs/common'
import { SessionOptionsFactory } from '@sneusers/modules/middleware/factories'
import { NextFunction, Request, Response } from 'express'
import session from 'express-session'

/**
 * @file Middleware - SessionMiddleware
 * @module sneusers/middleware/SessionMiddleware
 */

@Injectable()
class SessionMiddleware implements NestMiddleware {
  constructor(protected readonly factory: SessionOptionsFactory) {}

  /**
   * Enables [`express-session`][1].
   *
   * [1]: https://github.com/expressjs/session
   *
   * @param {Request} req - Incoming request
   * @param {Response} res - Server response
   * @param {NextFunction} next - Function to invoke next middleware function
   * @return {void} Empty promise when complete
   */
  use(req: Request, res: Response, next: NextFunction): void {
    return session(this.factory.createSessionOptions())(req, res, next)
  }
}

export default SessionMiddleware
