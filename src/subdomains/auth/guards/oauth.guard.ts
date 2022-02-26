import { ExceptionCode } from '@flex-development/exceptions/enums'
import { OrPromise } from '@flex-development/tutils'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import type { Request } from 'express'
import { Observable } from 'rxjs'
import { OAuthProvider } from '../enums'
import { AuthenticateOptions } from '../namespaces'
import AuthGuard from './auth.guard'

/**
 * @file Auth Subdomain Guards - OAuthGuard
 * @module sneusers/subdomains/auth/guards/OAuthGuard
 */

@Injectable()
class OAuthGuard extends AuthGuard() implements CanActivate {
  /**
   * Checks if `value` is a valid {@link OAuthProvider}.
   *
   * @static
   * @param {any} [value] - Value to check
   * @return {boolean} `true` if `value` is `OAuthProvider`, `false` otherwise
   */
  static isOAuthProvider(value?: any): value is OAuthProvider {
    return Object.values(OAuthProvider).includes(value)
  }

  /**
   * Validates authentication providers.
   *
   * @param {ExecutionContext} context - Request pipeline details
   * @return {OrPromise<boolean> | Observable<boolean>} Guard activation boolean
   * @throws {Exception}
   */
  canActivate(
    context: ExecutionContext
  ): OrPromise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>()

    if (!OAuthGuard.isOAuthProvider(req.params.provider)) {
      throw new Exception<{ provider?: string }>(ExceptionCode.FORBIDDEN, '', {
        errors: [{ provider: req.params.provider }],
        message: 'Invalid oauth provider',
        req: { params: req.params, query: req.query }
      })
    }

    this.options.defaultStrategy = req.params.provider

    return super.canActivate(context)
  }

  /**
   * Returns [`passport.authenticate`][1] options.
   *
   * [1]: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
   *
   * @param {ExecutionContext} context - Request pipeline details
   * @return {AuthenticateOptions.OAuth} `passport.authenticate` options
   */
  getAuthenticateOptions(context: ExecutionContext): AuthenticateOptions.OAuth {
    const req = context.switchToHttp().getRequest<Request>()
    const options: AuthenticateOptions.OAuth = {}

    if (req.params.provider === OAuthProvider.GITHUB) {
      options.allow_signup = 'false'
    }

    if (req.params.provider === OAuthProvider.GOOGLE) {
      options.accessType = 'offline'
      options.includeGrantedScopes = true
      options.prompt = 'consent'
    }

    return {
      ...super.getAuthenticateOptions(context),
      ...options,
      defaultStrategy: req.params.provider,
      session: true
    }
  }
}

export default OAuthGuard
