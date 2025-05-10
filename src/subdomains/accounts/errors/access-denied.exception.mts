/**
 * @file Errors - AccessDeniedException
 * @module sneusers/accounts/errors/AccessDeniedException
 */

import {
  Exception,
  ExceptionCode,
  ExceptionId
} from '@flex-development/sneusers/errors'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * An access denied exception.
 *
 * @class
 * @extends {Exception}
 */
@ApiSchema()
class AccessDeniedException extends Exception {
  /**
   * HTTP response status code.
   *
   * @public
   * @instance
   * @member {ExceptionCode.FORBIDDEN} code
   */
  @ApiProperty({ enum: [ExceptionCode.FORBIDDEN] })
  declare public code: (typeof ExceptionCode)['FORBIDDEN']

  /**
   * Unique id representing the exception.
   *
   * @public
   * @instance
   * @member {ExceptionId.ACCESS_DENIED} id
   */
  @ApiProperty({ enum: [ExceptionId.ACCESS_DENIED] })
  declare public id: (typeof ExceptionId)['ACCESS_DENIED']

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
   * Create a new access denied exception.
   */
  constructor() {
    super({
      code: ExceptionCode.FORBIDDEN,
      id: ExceptionId.ACCESS_DENIED,
      message: 'Access denied',
      reason: null
    })

    this.name = 'AccessDeniedException'
  }
}

export default AccessDeniedException
