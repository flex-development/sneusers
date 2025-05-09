/**
 * @file Strategies - JwtStrategy
 * @module sneusers/accounts/strategies/Jwt
 */

import JwtOptionsFactory from '#accounts/factories/jwt-options.factory'
import AccountsRepository from '#accounts/providers/accounts.repository'
import type { Account } from '@flex-development/sneusers/accounts'
import type { JsonObject } from '@flex-development/sneusers/types'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ok } from 'devlop'
import { ExtractJwt, Strategy } from 'passport-jwt'

/**
 * JWT authentication strategy.
 *
 * @class
 */
@Injectable()
class JwtStrategy extends PassportStrategy<typeof Strategy, Account>(Strategy) {
  /**
   * Create a new JWT authentication strategy.
   *
   * @param {AccountsRepository} accounts
   *  User accounts repository
   * @param {JwtOptionsFactory} options
   *  JWT options factory
   */
  constructor(
    protected accounts: AccountsRepository,
    options: JwtOptionsFactory
  ) {
    const { secret, signOptions } = options.createJwtOptions()

    ok(typeof secret === 'string', 'expected `secret` to be a string')
    ok(signOptions, 'expected jwt signing options')

    super({
      audience: signOptions.audience,
      ignoreExpiration: false,
      issuer: signOptions.issuer,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: false,
      secretOrKey: secret
    })
  }

  /**
   * Get the user account associated with `payload`.
   *
   * @public
   * @instance
   * @async
   *
   * @param {JsonObject} payload
   *  Token payload
   * @return {Account | null}
   *  The account of the authenticated user or `null`
   */
  public async validate(payload: JsonObject): Promise<Account | null> {
    /**
     * The account of the authenticated user.
     *
     * @var {Account | null} account
     */
    let account: Account | null = null

    if ('email' in payload && typeof payload['email'] === 'string') {
      account = await this.accounts.findByEmail(payload['email'])
    }

    return account
  }
}

export default JwtStrategy
