import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '@sneusers/subdomains/auth/providers'
import { User } from '@sneusers/subdomains/users/entities'
import type { IStrategyOptionsWithRequest } from 'passport-local'
import { Strategy } from 'passport-local'

/**
 * @file Authentication Strategies - Local
 * @module sneusers/subdomains/auth/strategies/LocalStrategy
 */

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({
      passReqToCallback: false,
      session: false,
      usernameField: 'email'
    } as IStrategyOptionsWithRequest & { passReqToCallback: false })
  }

  /**
   * Authenticates a user.
   *
   * @async
   * @param {string} email - User email
   * @param {NullishString} password - User password
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validate(
    email: User['email'],
    password: User['password']
  ): Promise<User> {
    return await this.auth.authenticate(email, password)
  }
}

export default LocalStrategy
