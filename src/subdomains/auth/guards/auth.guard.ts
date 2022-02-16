import { ExceptionCode } from '@flex-development/exceptions/enums'
import {
  ObjectPlain,
  OneOrMany,
  OrNull,
  OrUndefined
} from '@flex-development/tutils'
import { ExecutionContext, mixin, Type } from '@nestjs/common'
import {
  AuthGuard as NestAuthGuard,
  IAuthGuard,
  IAuthModuleOptions
} from '@nestjs/passport'
import { Exception } from '@sneusers/exceptions'
import { User } from '@sneusers/subdomains/users/entities'
import { AuthenticateOptions } from 'passport'

/**
 * @file Auth Subdomain Guards - AuthGuard
 * @module sneusers/subdomains/auth/guards/AuthGuard
 */

/**
 * Creates an base authentication guard.
 *
 * @template TUser - User type
 *
 * @param {OneOrMany<string>} [type] - Authentication strategies
 * @return {Type<IAuthGuard>} New {@link AuthGuard} class
 */
function createAuthGuard<TUser extends User = User>(
  type?: OneOrMany<string>
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
    /**
     * Returns [`passport.authenticate`][1] options.
     *
     * [1]: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
     *
     * @param {ExecutionContext} context - Details about current request
     * @return {IAuthModuleOptions & AuthenticateOptions} Authentication options
     */
    getAuthenticateOptions(
      context: ExecutionContext
    ): IAuthModuleOptions & AuthenticateOptions {
      return {
        ...super.getAuthenticateOptions(context),
        authInfo: true,
        failWithError: true,
        property: 'user'
      }
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
     * @param {ExecutionContext} context - Details about current request
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
