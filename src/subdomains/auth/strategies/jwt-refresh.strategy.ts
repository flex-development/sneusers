import { OrNull } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ENV } from '@sneusers/config/configuration'
import { RefreshTokenPayload } from '@sneusers/subdomains/auth/dtos'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import { User } from '@sneusers/subdomains/users/entities'
import type { Request } from 'express'
import type { StrategyOptions } from 'passport-jwt'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * @file Authentication Strategies - JwtRefresh
 * @module sneusers/subdomains/auth/strategies/JwtRefreshStrategy
 */

@Injectable()
class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly auth: AuthService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([JwtRefreshStrategy.extract]),
      passReqToCallback: true,
      secretOrKey: ENV.JWT_SECRET_REFRESH
    } as StrategyOptions)
  }

  /**
   * Extracts a refresh token from the `Refresh` cookie.
   *
   * @param {Request} req - Incoming request
   * @return {OrNull<string>} Extracted refresh token
   */
  static extract(req: Request): OrNull<string> {
    return req?.cookies?.Refresh ?? null
  }

  /**
   * Returns an authenticated user.
   *
   * > Passport will build a `user` object based on the return value of our
   * > `validate()` method, and attach it as a property on the `Request` object.
   *
   * @see https://docs.nestjs.com/security/authentication#implementing-passport-jwt
   *
   * @async
   * @param {Request} req - Incoming request
   * @param {RefreshTokenPayload} payload - Refresh token payload
   * @param {string} payload.email - User's email address
   * @param {string} payload.first_name - User's first name
   * @param {number} payload.id - User's id
   * @param {string} payload.last_name - User's last name
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validate(req: Request, payload: RefreshTokenPayload): Promise<User> {
    return await this.auth.authenticate(
      payload.sub,
      null,
      JwtRefreshStrategy.extract(req)
    )
  }
}

export default JwtRefreshStrategy
