/**
 * @file Errors - EmailConflictException
 * @module sneusers/accounts/errors/EmailConflictException
 */

import Reason from '#accounts/errors/email-conflict.reason'
import {
  Exception,
  ExceptionCode,
  ExceptionId
} from '@flex-development/sneusers/errors'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * An email conflict exception.
 *
 * @class
 * @extends {Exception}
 */
@ApiSchema()
class EmailConflictException extends Exception {
  /**
   * HTTP response status code.
   *
   * @public
   * @instance
   * @member {ExceptionCode.CONFLICT} code
   */
  @ApiProperty({ enum: [ExceptionCode.CONFLICT] })
  declare public code: (typeof ExceptionCode)['CONFLICT']

  /**
   * Unique id representing the exception.
   *
   * @public
   * @instance
   * @member {ExceptionId.EMAIL_CONFLICT} id
   */
  @ApiProperty({ enum: [ExceptionId.EMAIL_CONFLICT] })
  declare public id: (typeof ExceptionId)['EMAIL_CONFLICT']

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
   * Create a new email conflict exception.
   *
   * @param {string} email
   *  The conflicting email address
   */
  constructor(email: string) {
    super({
      code: ExceptionCode.CONFLICT,
      id: ExceptionId.EMAIL_CONFLICT,
      message: 'Email address must be unique',
      reason: new Reason(email)
    })

    this.name = 'EmailConflictException'
  }
}

export default EmailConflictException
