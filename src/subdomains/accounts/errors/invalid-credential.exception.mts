/**
 * @file Errors - InvalidCredentialException
 * @module sneusers/accounts/errors/InvalidCredentialException
 */

import {
  Exception,
  ExceptionCode,
  ExceptionId
} from '@flex-development/sneusers/errors'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * An invalid credential exception.
 *
 * @class
 * @extends {Exception}
 */
@ApiSchema()
class InvalidCredentialException extends Exception {
  /**
   * HTTP response status code.
   *
   * @public
   * @instance
   * @member {ExceptionCode.UNAUTHORIZED} code
   */
  @ApiProperty({ enum: [ExceptionCode.UNAUTHORIZED] })
  declare public code: (typeof ExceptionCode)['UNAUTHORIZED']

  /**
   * Unique id representing the exception.
   *
   * @public
   * @instance
   * @member {ExceptionId.INVALID_CREDENTIAL} id
   */
  @ApiProperty({ enum: [ExceptionId.INVALID_CREDENTIAL] })
  declare public id: (typeof ExceptionId)['INVALID_CREDENTIAL']

  /**
   * The reason for the exception.
   *
   * @public
   * @instance
   * @member {null} reason
   */
  @ApiProperty({ type: 'null' })
  declare public reason: null

  /**
   * Create a new invalid credential exception.
   */
  constructor() {
    super({
      code: ExceptionCode.UNAUTHORIZED,
      id: ExceptionId.INVALID_CREDENTIAL,
      message: 'Invalid credential',
      reason: null
    })

    this.name = 'InvalidCredentialException'
  }
}

export default InvalidCredentialException
