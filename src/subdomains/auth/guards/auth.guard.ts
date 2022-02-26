import { ExceptionCode } from '@flex-development/exceptions/enums'
import {
  ObjectPlain,
  OneOrMany,
  OrNull,
  OrPromise,
  OrUndefined
} from '@flex-development/tutils'
import { ExecutionContext, mixin, Type } from '@nestjs/common'
import { AuthGuard as NestAuthGuard } from '@nestjs/passport'
import { Exception } from '@sneusers/exceptions'
import { User } from '@sneusers/subdomains/users/entities'
import { Request, Response } from 'express'
import { AuthStrategy } from '../enums'
import { IAuthGuard } from '../interfaces'
import { AuthenticateOptions } from '../namespaces'

/**
 * @file Auth Subdomain Guards - AuthGuard
 * @module sneusers/subdomains/auth/guards/AuthGuard
 */

/**
 * Creates a base authentication guard.
 *
 * @template TUser - User type
 *
 * @param {OneOrMany<AuthStrategy>} [type] - Authentication strategies
 * @return {Type<IAuthGuard>} New {@link AuthGuard} class
 */
function createAuthGuard<TUser extends User = User>(
  type?: OneOrMany<AuthStrategy>
): Type<IAuthGuard> {
  /**
   * Base authentication guard.
   *
   * @see https://docs.nestjs.com/guards
   * @see https://docs.nestjs.com/security/authentication#extending-guards
   *
   * @template U - User type
   *
   * @extends NestAuthGuard(type)
   * @implements {IAuthGuard}
   */
  class AuthGuard<U extends TUser = TUser>
    extends NestAuthGuard(type)
    implements IAuthGuard
  {
    /** @property {IAuthGuard['options']} options - Auth options */
    options: IAuthGuard['options'] = {}

    /**
     * Returns [`passport.authenticate`][1] options.
     *
     * [1]: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
     *
     * @return {OrPromise<AuthenticateOptions.Base>} Authentication options
     */
    getAuthenticateOptions(): OrPromise<AuthenticateOptions.Base> {
      return {}
    }

    /**
     * Retrieves the incoming request from `context`.
     *
     * @template T - Request type
     *
     * @param {ExecutionContext} context - Request pipeline details
     * @return {T} Incoming request
     */
    getRequest<T extends Request = Request>(context: ExecutionContext): T {
      return context.switchToHttp().getRequest<T>()
    }

    /**
     * Retrieves the outgoing server response from `context`.
     *
     * @template T - Response type
     *
     * @param {ExecutionContext} context - Request pipeline details
     * @return {T} Server response
     */
    getResponse<T extends Response = Response>(context: ExecutionContext): T {
      return context.switchToHttp().getResponse<T>()
    }

    /**
     * Intercepts authentication attempts.
     *
     * @see https://github.com/nestjs/passport/blob/master/lib/auth.guard.ts
     * @see https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
     *
     * @template T - User type
     *
     * @param {OrNull<Error | Exception>} err - Error thrown, if any
     * @param {T | false} [user] - Authenticated user, if any
     * @param {OneOrMany<ObjectPlain>} [info] - Additional strategy info
     * @param {ExecutionContext} context - Request pipeline details
     * @param {OneOrMany<ExceptionCode>} [status] - HTTP status error code
     * @return {T} Authenticated user
     * @throws {Exception}
     */
    handleRequest<T = U>(
      err: OrNull<Error | Exception>,
      user: OrUndefined<T | false>,
      info: OrUndefined<OneOrMany<ObjectPlain>>,
      context: ExecutionContext,
      status: OrUndefined<OneOrMany<ExceptionCode>>
    ): T {
      if (err || !user) {
        if (err instanceof Exception) throw err

        const data = {
          code: Array.isArray(status) ? status[0] : status,
          errors: Array.isArray(info) ? info : err || info ? [err || info] : [],
          message: Array.isArray(info)
            ? info.length === 1
              ? info[0].message
              : undefined
            : info?.message
        }

        throw new Exception<Error | ObjectPlain>(
          ExceptionCode.UNAUTHORIZED,
          err?.message ?? 'Unauthorized',
          data,
          err?.stack
        )
      }

      return super.handleRequest<T>(err, user, info, context, status)
    }
  }

  return mixin(AuthGuard)
}

export default createAuthGuard
