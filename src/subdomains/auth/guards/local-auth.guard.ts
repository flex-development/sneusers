import { CanActivate, Injectable } from '@nestjs/common'
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'

/**
 * @file Auth Subdomain Guards - LocalAuthGuard
 * @module sneusers/subdomains/auth/guards/LocalAuthGuard
 */

@Injectable()
class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  /**
   * Returns an object containing local authentication options.
   *
   * @return {IAuthModuleOptions} Local authentication options
   */
  getAuthenticateOptions(): IAuthModuleOptions {
    return { defaultStrategy: 'local', property: 'user', session: false }
  }
}

export default LocalAuthGuard
