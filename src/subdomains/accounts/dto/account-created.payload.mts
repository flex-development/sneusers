/**
 * @file Data Transfer Objects - AccountCreatedPayload
 * @module sneusers/accounts/dto/AccountCreatedPayload
 */

import type { Account } from '@flex-development/sneusers/accounts'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * Successful account creation response.
 *
 * @class
 */
@ApiSchema()
class AccountCreatedPayload {
  /**
   * User access token.
   *
   * @public
   * @instance
   * @member {string} access_token
   */
  @ApiProperty({
    description: 'token for authenticating requests',
    type: 'string'
  })
  public access_token: string

  /**
   * User refresh token.
   *
   * @public
   * @instance
   * @member {string} refresh_token
   */
  @ApiProperty({
    description: 'token for renewing access tokens',
    type: 'string'
  })
  public refresh_token: string

  /**
   * Unique account id.
   *
   * @public
   * @instance
   * @member {string} uid
   */
  @ApiProperty({ description: 'unique account id', type: 'string' })
  public uid: string

  /**
   * Create a new account creation payload.
   *
   * @param {Account} account
   *  The new account
   * @param {string} access_token
   *  User access token
   * @param {string} refresh_token
   *  User refresh token
   */
  constructor(account: Account, access_token: string, refresh_token: string) {
    this.uid = account.uid
    this.access_token = access_token
    this.refresh_token = refresh_token
  }
}

export default AccountCreatedPayload
