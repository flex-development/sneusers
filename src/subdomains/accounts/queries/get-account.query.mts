/**
 * @file Queries - GetAccountQuery
 * @module sneusers/accounts/queries/GetAccount
 */

import type { Account } from '@flex-development/sneusers/accounts'
import { Query } from '@nestjs/cqrs'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'
import type { ObjectId } from 'bson'

/**
 * Get account query.
 *
 * @class
 * @extends {Query<Account>}
 */
@ApiSchema()
class GetAccountQuery extends Query<Account> {
  /**
   * The id of the account to retrieve.
   *
   * @public
   * @instance
   * @member {string} uid
   */
  @ApiProperty({ description: 'id of account to retrieve', type: 'string' })
  public uid!: string

  /**
   * Create a new account query.
   *
   * @param {ObjectId | string | null | undefined} [uid]
   *  The id of the account to retrieve
   */
  constructor(uid?: ObjectId | string | null | undefined) {
    super()
    if (uid !== null && uid !== undefined) this.uid = String(uid)
  }
}

export default GetAccountQuery
