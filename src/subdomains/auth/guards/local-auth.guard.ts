import { Injectable } from '@nestjs/common'
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'
import { AuthStrategy } from '@sneusers/subdomains/auth/enums'
import { AuthenticateOptions } from 'passport'

/**
 * @file Auth Subdomain Guards - LocalAuthGuard
 * @module sneusers/subdomains/auth/guards/LocalAuthGuard
 */

@Injectable()
class LocalAuthGuard extends AuthGuard(AuthStrategy.LOCAL) {
  /**
   * Returns authentication options.
   *
   * @return {IAuthModuleOptions & AuthenticateOptions} Authentication options
   */
  getAuthenticateOptions(): IAuthModuleOptions & AuthenticateOptions {
    return {
      authInfo: true,
      property: 'user',
      session: false
    }
  }
}

export default LocalAuthGuard
