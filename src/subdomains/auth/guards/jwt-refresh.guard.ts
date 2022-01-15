import { CanActivate, Injectable } from '@nestjs/common'
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'

/**
 * @file Auth Subdomain Guards - JwtRefreshGuard
 * @module sneusers/subdomains/auth/guards/JwtRefreshGuard
 */

@Injectable()
class JwtRefreshGuard extends AuthGuard('jwt-refresh') implements CanActivate {
  /**
   * Returns an object containing jwt authentication options.
   *
   * @return {IAuthModuleOptions} JWT authentication options
   */
  getAuthenticateOptions(): IAuthModuleOptions {
    return { defaultStrategy: 'jwt-refresh', property: 'user', session: false }
  }
}

export default JwtRefreshGuard
