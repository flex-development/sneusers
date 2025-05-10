/**
 * @file Errors - MissingAccountException
 * @module sneusers/accounts/errors/MissingAccountException
 */

import Reason from '#accounts/errors/missing-account.reason'
import {
  Exception,
  ExceptionCode,
  ExceptionId
} from '@flex-development/sneusers/errors'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'
import type { ObjectId } from 'bson'

/**
 * A missing account exception.
 *
 * @class
 * @extends {Exception}
 */
@ApiSchema()
class MissingAccountException extends Exception {
  /**
   * HTTP response status code.
   *
   * @public
   * @instance
   * @member {ExceptionCode.NOT_FOUND} code
   */
  @ApiProperty({ enum: [ExceptionCode.NOT_FOUND] })
  declare public code: (typeof ExceptionCode)['NOT_FOUND']

  /**
   * Unique id representing the exception.
   *
   * @public
   * @instance
   * @member {ExceptionId.ACCOUNT_NOT_FOUND} code
   */
  @ApiProperty({ enum: [ExceptionId.MISSING_ACCOUNT] })
  declare public id: (typeof ExceptionId)['MISSING_ACCOUNT']

  /**
   * The reason for the exception.
   *
   * @public
   * @instance
   * @member {Reason} reason
   */
  @ApiProperty({ type: Reason })
  declare public reason: Reason

  /**
   * Create a new missing account exception.
   *
   * @param {ObjectId | string} uid
   *  The id of the account that was not found
   */
  constructor(uid: ObjectId | string) {
    super({
      code: ExceptionCode.NOT_FOUND,
      id: ExceptionId.MISSING_ACCOUNT,
      message: 'Account not found',
      reason: new Reason(uid)
    })

    this.name = 'MissingAccountException'
  }
}

export default MissingAccountException
