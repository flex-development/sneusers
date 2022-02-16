import { ExecutionContext, Injectable } from '@nestjs/common'
import { IAuthModuleOptions } from '@nestjs/passport'
import { AuthenticateOptions } from 'passport'
import { AuthStrategy } from '../enums'
import AuthGuard from './auth.guard'

/**
 * @file Auth Subdomain Guards - JwtRefreshGuard
 * @module sneusers/subdomains/auth/guards/JwtRefreshGuard
 */

@Injectable()
class JwtRefreshGuard extends AuthGuard(AuthStrategy.JWT_REFRESH) {
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
      session: false
    }
  }
}

export default JwtRefreshGuard
