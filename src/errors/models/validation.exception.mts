/**
 * @file Errors - ValidationException
 * @module sneusers/errors/ValidationException
 */

import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import Exception from '#errors/models/base.exception'
import Reason from '#errors/models/validation.reason'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'
import type { ValidationError } from 'class-validator'

/**
 * An exception representing a validation failure.
 *
 * @class
 * @extends {Exception}
 */
@ApiSchema()
class ValidationException extends Exception {
  /**
   * HTTP response status code.
   *
   * @public
   * @instance
   * @member {ExceptionCode.BAD_REQUEST} code
   */
  @ApiProperty({ enum: [ExceptionCode.BAD_REQUEST] })
  declare public code: (typeof ExceptionCode)['BAD_REQUEST']

  /**
   * Unique id representing the exception.
   *
   * @public
   * @instance
   * @member {ExceptionId.VALIDATION_FAILURE} code
   */
  @ApiProperty({ enum: [ExceptionId.VALIDATION_FAILURE] })
  declare public id: (typeof ExceptionId)['VALIDATION_FAILURE']

  /**
   * The reason for the exception.
   *
   * @public
   * @instance
   * @member {ValidationFailure} reason
   */
  @ApiProperty({ type: Reason })
  declare public reason: Reason

  /**
   * Create a new validation exception.
   *
   * @param {ValidationError} info
   *  The validation error
   */
  constructor(info: ValidationError) {
    super({
      code: ExceptionCode.BAD_REQUEST,
      id: ExceptionId.VALIDATION_FAILURE,
      message: `Property ${info.property} is invalid`,
      reason: new Reason(info)
    })

    Error.captureStackTrace(this, this.constructor)
    this.name = 'ValidationException'
  }
}

export default ValidationException
