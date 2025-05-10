/**
 * @file Errors - MissingAccount
 * @module sneusers/accounts/errors/MissingAccount
 */

import { Reason } from '@flex-development/sneusers/errors'
import type { JsonObject } from '@flex-development/sneusers/types'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'
import type { ObjectId } from 'bson'

/**
 * The reason for a missing account exception.
 *
 * @class
 * @extends {Reason}
 */
@ApiSchema()
class MissingAccount extends Reason {
  /**
   * The id of the missing account.
   *
   * @public
   * @instance
   * @member {string} uid
   */
  @ApiProperty({ description: 'id of missing account', type: 'string' })
  public uid: string

  /**
   * Create a missing account exception info object.
   *
   * @param {ObjectId | string} uid
   *  The id of the account that was not found
   */
  constructor(uid: ObjectId | string) {
    super()
    this.uid = String(uid)
  }

  /**
   * Get a JSON representation of the exception info.
   *
   * @public
   * @instance
   *
   * @return {JsonObject}
   *  JSON representation of `this` exception info
   */
  public toJSON(): JsonObject {
    return { uid: this.uid }
  }
}

export default MissingAccount
