import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ENV } from '@sneusers/config/configuration'
import { AccessTokenPayload } from '@sneusers/subdomains/auth/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UsersService } from '@sneusers/subdomains/users/providers'
import type { StrategyOptions } from 'passport-jwt'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * @file Authentication Strategies - Jwt
 * @module sneusers/subdomains/auth/strategies/JwtStrategy
 */

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly users: UsersService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      passReqToCallback: false,
      secretOrKey: ENV.JWT_SECRET_ACCESS
    } as StrategyOptions)
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
   * @param {AccessTokenPayload} payload - Access token payload
   * @param {string} payload.email - User's email address
   * @param {string} payload.first_name - User's first name
   * @param {number} payload.id - User's id
   * @param {string} payload.last_name - User's last name
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validate(payload: AccessTokenPayload): Promise<User> {
    return (await this.users.findOne(payload.sub)) as User
  }
}

export default JwtStrategy
