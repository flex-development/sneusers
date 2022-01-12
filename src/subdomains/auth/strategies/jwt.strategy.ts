import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { JwtPayload } from '@sneusers/subdomains/auth/dtos'
import { JwtConfigService } from '@sneusers/subdomains/auth/providers'
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
  constructor(
    private readonly config: JwtConfigService,
    private readonly users: UsersService
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      passReqToCallback: false,
      secretOrKey: config.createJwtOptions().secret
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
   * @param {JwtPayload} payload - Data used to create a user access token
   * @param {string} payload.email - User's email address
   * @param {string} payload.first_name - User's first name
   * @param {number} payload.id - User's id
   * @param {string} payload.last_name - User's last name
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validate(payload: JwtPayload): Promise<User> {
    return (await this.users.findOne(payload.id)) as User
  }
}

export default JwtStrategy
