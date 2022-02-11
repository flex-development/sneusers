import { ExceptionCode } from '@flex-development/exceptions/enums'
import { OrNull } from '@flex-development/tutils'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'
import { Exception } from '@sneusers/exceptions'
import { User } from '@sneusers/subdomains/users/entities'
import type { Request } from 'express'
import { AuthenticateOptions } from 'passport'
import { ExtractJwt } from 'passport-jwt'
import { AuthMetadataKey, AuthStrategy } from '../enums'

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

  /**
   * Intercepts authentication attempts.
   *
   * @template TUser - User entity
   *
   * @param {OrNull<Error>} err - Error thrown, if any
   * @param {TUser | false} user - Authenticated user if attempt was successful
   * @param {OrNull<Error>} info - Error info
   * @param {ExecutionContext} context - Details about current request pipeline
   * @param {ExceptionCode} [status] - HTTP status if error occurred
   * @return {TUser} Authenticated user
   * @throws {Exception}
   */
  handleRequest<TUser extends User>(
    err: OrNull<Error>,
    user: TUser | false,
    info: OrNull<Error>,
    context: ExecutionContext,
    status?: ExceptionCode
  ): TUser {
    if (err || info || !user) {
      const error = err || info
      const data = { code: status, errors: error ? [error] : [] }

      throw new Exception<Error>(
        ExceptionCode.UNAUTHORIZED,
        error?.message ?? 'Unauthorized',
        data,
        error?.stack
      )
    }

    return super.handleRequest(err, user, info, context, status)
  }
}

export default JwtAuthGuard
