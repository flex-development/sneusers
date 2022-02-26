import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import JwtAuthGuard from './jwt-auth.guard'

/**
 * @file Auth Subdomain Guards - WhoamiGuard
 * @module sneusers/subdomains/auth/guards/WhoamiGuard
 */

@Injectable()
class WhoamiGuard extends JwtAuthGuard implements CanActivate {
  /**
   * Allows a route to authenticate a user using an access token and **fail
   * silently** if there's an error identifying the user.
   *
   * @param {ExecutionContext} context - Request pipeline details pipeline
   * @return {true} `true`
   */
  canActivate(context: ExecutionContext): true {
    const req = context.switchToHttp().getRequest<Request>()
    const access_token = req.headers['authorization']

    if (!access_token) return true

    try {
      return super.canActivate(context) as true
    } catch {
      return true
    }
  }
}

export default WhoamiGuard
