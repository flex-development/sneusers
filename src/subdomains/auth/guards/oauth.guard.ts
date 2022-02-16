import { ExecutionContext, Injectable } from '@nestjs/common'
import { IAuthModuleOptions } from '@nestjs/passport'
import { AuthenticateOptions } from 'passport'
import { AuthStrategy } from '../enums'
import AuthGuard from './auth.guard'

/**
 * @file Auth Subdomain Guards - OAuthGuard
 * @module sneusers/subdomains/auth/guards/OAuthGuard
 */

@Injectable()
class OAuthGuard extends AuthGuard([AuthStrategy.GITHUB]) {
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
      session: true
    }
  }
}

export default OAuthGuard
