import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@sneusers/subdomains/users/entities'
import type { IStrategyOptions } from 'passport-local'
import { Strategy } from 'passport-local'
import { AbstractStrategy } from '../abstracts'
import { AuthStrategy } from '../enums'
import { Strategist } from '../providers'

/**
 * @file Authentication Strategies - Local
 * @module sneusers/subdomains/auth/strategies/LocalStrategy
 */

@Injectable()
class LocalStrategy
  extends PassportStrategy(Strategy, AuthStrategy.LOCAL)
  implements AbstractStrategy
{
  constructor(protected readonly strategist: Strategist) {
    super({
      passReqToCallback: false,
      passwordField: 'password',
      session: false,
      usernameField: 'email'
    } as IStrategyOptions)
  }

  /**
   * Authenticates a user.
   *
   * Once authenticated, a `user` property will be added to the current request.
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
    return this.strategist.validateLocal(email, password)
  }
}

export default LocalStrategy
