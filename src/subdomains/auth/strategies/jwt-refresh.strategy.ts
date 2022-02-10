import { OrNull } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport'
import { EnvironmentVariables } from '@sneusers/models'
import { JwtPayloadRefresh } from '@sneusers/subdomains/auth/dtos'
import { AuthStrategy, TokenType } from '@sneusers/subdomains/auth/enums'
import { Strategist } from '@sneusers/subdomains/auth/providers'
import { User } from '@sneusers/subdomains/users/entities'
import type { Request } from 'express'
import type { StrategyOptions } from 'passport-jwt'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * @file Authentication Strategies - JwtRefresh
 * @module sneusers/subdomains/auth/strategies/JwtRefreshStrategy
 */

@Injectable()
class JwtRefreshStrategy
  extends PassportStrategy(Strategy, AuthStrategy.JWT_REFRESH)
  implements AbstractStrategy
{
  constructor(
    protected readonly strategist: Strategist,
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([JwtRefreshStrategy.extract]),
      passReqToCallback: true,
      secretOrKey: config.get<string>('JWT_SECRET_REFRESH')
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
   * Authenticates a user.
   *
   * Once authenticated, a `user` property will be added to the current request.
   *
   * @async
   * @param {Request} req - Incoming request
   * @param {JwtPayloadRefresh} payload - Refresh token payload
   * @param {string} payload.jti - Refresh token id
   * @param {string} payload.sub - Token owner id
   * @param {TokenType.REFRESH} payload.type - Token type
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validate(req: Request, payload: JwtPayloadRefresh): Promise<User> {
    const validated = await this.strategist.validateToken(
      TokenType.REFRESH,
      JwtRefreshStrategy.extract(req),
      payload.sub
    )

    return validated.user
  }
}

export default JwtRefreshStrategy
