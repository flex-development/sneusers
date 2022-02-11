import { Injectable } from '@nestjs/common'
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'
import { AuthenticateOptions } from 'passport'
import { AuthStrategy } from '../enums'

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
