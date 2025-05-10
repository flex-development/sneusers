/**
 * @file Errors - EmailConflict
 * @module sneusers/accounts/errors/EmailConflict
 */

import { Reason } from '@flex-development/sneusers/errors'
import type { JsonObject } from '@flex-development/sneusers/types'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * The reason for an email conflict exception.
 *
 * @class
 * @extends {Reason}
 */
@ApiSchema()
class EmailConflict extends Reason {
  /**
   * The conflicting email address.
   *
   * @public
   * @instance
   * @member {string} email
   */
  @ApiProperty({ description: 'the conflicting email address', type: 'string' })
  public email: string

  /**
   * Create an email conflict exception info object.
   *
   * @param {string} email
   *  The conflicting email address
   */
  constructor(email: string) {
    super()
    this.email = email
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
    return { email: this.email }
  }
}

export default EmailConflict
