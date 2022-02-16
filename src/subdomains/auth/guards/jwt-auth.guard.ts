import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IAuthModuleOptions } from '@nestjs/passport'
import type { Request } from 'express'
import { AuthenticateOptions } from 'passport'
import { ExtractJwt } from 'passport-jwt'
import { AuthMetadataKey, AuthStrategy } from '../enums'
import AuthGuard from './auth.guard'

/**
 * @file Auth Subdomain Guards - JwtAuthGuard
 * @module sneusers/subdomains/auth/guards/JwtAuthGuard
 */

@Injectable()
class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) implements CanActivate {
  constructor(protected readonly reflector: Reflector) {
    super()
  }

  /**
   * Determines if a route will require an access token.
   *
   * If an access token is optional, but provided anyway, it'll be verified.
   *
   * @param {ExecutionContext} context - Get data from current request pipeline
   * @return {boolean} `true` if anon requests are allowed, `false` otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>()
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

    const SKIP_TOKEN = this.reflector.getAllAndOverride<boolean>(
      AuthMetadataKey.JWT_OPTIONAL,
      [context.getHandler(), context.getClass()]
    )

    return SKIP_TOKEN && !token ? true : (super.canActivate(context) as boolean)
  }

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

export default JwtAuthGuard
