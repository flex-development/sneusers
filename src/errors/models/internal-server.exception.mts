/**
 * @file Errors - InternalServerException
 * @module sneusers/errors/InternalServerException
 */

import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import Exception from '#errors/models/base.exception'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

/**
 * An exception representing an unhandled error.
 *
 * @class
 * @extends {Exception}
 */
@ApiSchema()
class InternalServerException extends Exception {
  /**
   * HTTP response status code.
   *
   * @public
   * @instance
   * @member {ExceptionCode.INTERNAL_SERVER_ERROR} code
   */
  @ApiProperty({ enum: [ExceptionCode.INTERNAL_SERVER_ERROR] })
  declare public code: (typeof ExceptionCode)['INTERNAL_SERVER_ERROR']

  /**
   * Unique id representing the error.
   *
   * @public
   * @instance
   * @member {ExceptionId.INTERNAL_SERVER_ERROR} code
   */
  @ApiProperty({ enum: [ExceptionId.INTERNAL_SERVER_ERROR] })
  declare public id: (typeof ExceptionId)['INTERNAL_SERVER_ERROR']

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
   * Create a new internal server exception.
   *
   * @param {Error | string} info
   *  The unhandled error or human-readable description of the exception
   */
  constructor(info: Error | string) {
    super({
      code: ExceptionCode.INTERNAL_SERVER_ERROR,
      id: ExceptionId.INTERNAL_SERVER_ERROR,
      message: info instanceof Error ? info.message : info,
      reason: null
    })

    Error.captureStackTrace(this, this.constructor)
    this.name = 'InternalServerException'
  }
}

export default InternalServerException
