import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport'
import { EnvironmentVariables } from '@sneusers/models'
import { User } from '@sneusers/subdomains/users/entities'
import type { StrategyOptions } from 'passport-jwt'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayloadAccess } from '../dtos'
import { AuthStrategy, TokenType } from '../enums'
import { Strategist } from '../providers'

/**
 * @file Authentication Strategies - Jwt
 * @module sneusers/subdomains/auth/strategies/JwtStrategy
 */

@Injectable()
class JwtStrategy
  extends PassportStrategy(Strategy, AuthStrategy.JWT)
  implements AbstractStrategy
{
  constructor(
    protected readonly strategist: Strategist,
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: false,
      secretOrKey: config.get<string>('JWT_SECRET_ACCESS')
    } as StrategyOptions)
  }

  /**
   * Authenticates a user.
   *
   * Once authenticated, a `user` property will be added to the current request.
   *
   * @async
   * @param {JwtPayloadAccess} payload - Access token payload
   * @param {string} payload.sub - User id
   * @param {TokenType.ACCESS} payload.type - Token type
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validate(payload: JwtPayloadAccess): Promise<User> {
    return await this.strategist.validatePayload(payload)
  }
}

export default JwtStrategy
