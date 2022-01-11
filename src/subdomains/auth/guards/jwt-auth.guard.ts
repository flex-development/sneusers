import { OrPromise } from '@flex-development/tutils'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'
import { UsersMetadataKey } from '@sneusers/subdomains/users/enums'
import type { Request } from 'express'
import { Observable } from 'rxjs'

/**
 * @file Auth Subdomain Guards - JwtAuthGuard
 * @module sneusers/subdomains/auth/guards/JwtAuthGuard
 */

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super()
  }

  /**
   * Determines if a route will enforce JWT authentication.
   *
   * @param {ExecutionContext} context - Object containing methods for accessing
   * current route handler and the class about to be invoked
   * @return {OrPromise<boolean> | Observable<boolean>} `true` if enforced
   */
  canActivate(
    context: ExecutionContext
  ): OrPromise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const key = UsersMetadataKey.AUTH_OPTIONAL
    const targets = [context.getHandler(), context.getClass()]

    const access_token = req.headers['authorization']
    const optional = this.reflector.getAllAndOverride<boolean>(key, targets)

    if (optional && !access_token) return true

    return super.canActivate(context)
  }

  /**
   * Returns an object containing jwt authentication options.
   *
   * @return {IAuthModuleOptions} JWT authentication options
   */
  getAuthenticateOptions(): IAuthModuleOptions {
    return { defaultStrategy: 'jwt', property: 'user', session: false }
  }
}

export default JwtAuthGuard
