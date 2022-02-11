import { Injectable } from '@nestjs/common'
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'
import { AuthenticateOptions } from 'passport'
import { AuthStrategy } from '../enums'

/**
 * @file Auth Subdomain Guards - JwtRefreshGuard
 * @module sneusers/subdomains/auth/guards/JwtRefreshGuard
 */

@Injectable()
class JwtRefreshGuard extends AuthGuard(AuthStrategy.JWT_REFRESH) {
  /**
   * Returns authentication options.
   *
   * @return {IAuthModuleOptions & AuthenticateOptions} Authentication options
   */
  getAuthenticateOptions(): IAuthModuleOptions & AuthenticateOptions {
    return {
      property: 'user',
      session: false
    }
  }
}

export default JwtRefreshGuard
