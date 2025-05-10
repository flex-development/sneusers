/**
 * @file Data Transfer Objects - AccountPayload
 * @module sneusers/accounts/dto/AccountPayload
 */

import Role from '#accounts/enums/role'
import type { Account } from '@flex-development/sneusers/accounts'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * Successful account retrieval response.
 *
 * @class
 */
@ApiSchema()
class AccountPayload {
  /**
   * User email address.
   *
   * @public
   * @instance
   * @member {Account['email']} email
   */
  @ApiProperty({
    description: 'primary email address',
    format: 'email',
    type: 'string'
  })
  public email: Account['email']

  /**
   * Account type.
   *
   * @public
   * @instance
   * @member {Account['role']} role
   */
  @ApiProperty({ description: 'account type', enum: Role })
  public type: Account['role']

  /**
   * Unique account id.
   *
   * @public
   * @instance
   * @member {Account['uid']} uid
   */
  @ApiProperty({ description: 'unique account id', type: 'string' })
  public uid: Account['uid']

  /**
   * Create a new account payload.
   *
   * @param {Account} account
   *  The accessed account
   */
  constructor(account: Account) {
    this.uid = account.uid
    this.type = account.role
    this.email = account.email
  }
}

export default AccountPayload
