/**
 * @file Services - AuthService
 * @module sneusers/accounts/services/Auth
 */

import type { Account } from '@flex-development/sneusers/accounts'
import type { Config } from '@flex-development/sneusers/types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

/**
 * Authentication and authorization service.
 *
 * @class
 */
@Injectable()
class AuthService {
  /**
   * Create a new auth service.
   *
   * @param {JwtService} jwt
   *  JSON web token service
   * @param {ConfigService<Config, true>} config
   *  Application config service
   */
  constructor(
    protected jwt: JwtService,
    protected config: ConfigService<Config, true>
  ) {}

  /**
   * Create an access token.
   *
   * @public
   * @instance
   * @async
   *
   * @param {Account} account
   *  The user account to create token for
   * @return {Promise<string>}
   *  User account access token
   */
  public async accessToken(account: Account): Promise<string> {
    return this.jwt.signAsync({
      email: account.email,
      iat: Date.now(),
      role: account.role
    }, {
      expiresIn: this.config.get('JWT_EXPIRY'),
      subject: account.uid
    })
  }

  /**
   * Create a refresh token.
   *
   * @public
   * @instance
   * @async
   *
   * @param {Account} account
   *  The user account to create token for
   * @return {Promise<string>}
   *  User account access refresh token
   */
  public async refreshToken(account: Account): Promise<string> {
    return this.jwt.signAsync({
      email: account.email,
      iat: Date.now(),
      role: account.role
    }, {
      expiresIn: this.config.get('JWT_EXPIRY_REFRESH'),
      subject: account.uid
    })
  }
}

export default AuthService
