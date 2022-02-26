import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthStrategy } from '../enums'
import { AuthenticateOptions } from '../namespaces'
import AuthGuard from './auth.guard'

/**
 * @file Auth Subdomain Guards - LocalAuthGuard
 * @module sneusers/subdomains/auth/guards/LocalAuthGuard
 */

@Injectable()
class LocalAuthGuard extends AuthGuard(AuthStrategy.LOCAL) {
  /**
   * Returns [`passport.authenticate`][1] options.
   *
   * [1]: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
   *
   * @param {ExecutionContext} context - Request pipeline details
   * @return {AuthenticateOptions.Base} Authentication options
   */
  getAuthenticateOptions(context: ExecutionContext): AuthenticateOptions.Base {
    return {
      ...super.getAuthenticateOptions(context),
      session: false
    }
  }
}

export default LocalAuthGuard
