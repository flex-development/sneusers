import {
  isExceptionCode,
  isExceptionJSON
} from '@flex-development/exceptions/guards'
import { NullishString, ObjectPlain } from '@flex-development/tutils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ExceptionDataDTO } from '@sneusers/dtos'
import {
  ExceptionClassName,
  ExceptionCode,
  ExceptionId,
  SequelizeErrorCode
} from '@sneusers/enums'
import { ExceptionJSON } from '@sneusers/interfaces'
import { ExceptionData, ExceptionErrors, SequelizeError } from '@sneusers/types'
import omit from 'lodash.omit'
import type { ValidationErrorItem } from 'sequelize'

/**
 * @file Filters - Exception
 * @module sneusers/filters/Exception
 */

/**
 * Base exception class.
 *
 * @template T - Aggregated error type
 */
export default class Exception<T = any> {
  /**
   * @static
   * @readonly
   * @property {string} DEFAULT_MESSAGE - Default error {@link message}
   */
  static readonly DEFAULT_MESSAGE: string = 'Unknown error'

  /**
   * @readonly
   * @property {ExceptionClassName} className - Associated CSS class name
   */
  @ApiProperty({
    description: 'Associated CSS class name',
    enum: ExceptionClassName,
    enumName: 'ExceptionClassName'
  })
  readonly className: ExceptionClassName

  /**
   * @readonly
   * @property {ExceptionCode} code - HTTP error response status code
   */
  @ApiProperty({
    description: 'HTTP error response status code',
    enum: ExceptionCode,
    enumName: 'ExceptionCode'
  })
  readonly code: ExceptionCode

  /**
   * @readonly
   * @property {ExceptionData} data - Custom error data
   */
  @ApiProperty({ description: 'Custom error data', type: Object })
  readonly data: ExceptionData

  /**
   * @readonly
   * @property {ExceptionErrors<T>} errors - Aggregated errors
   */
  @ApiProperty({ description: 'Aggregated errors', type: [Object] })
  readonly errors: ExceptionErrors<T>

  /**
   * @readonly
   * @property {ExceptionId} id - HTTP error response type
   */
  @ApiProperty({
    description: 'HTTP error response type',
    enum: ExceptionId,
    enumName: 'ExceptionId',
    name: 'name'
  })
  readonly id: ExceptionId

  /**
   * @readonly
   * @property {string} message - Error message
   */
  @ApiProperty({ description: 'Reason exception was thrown', type: String })
  readonly message: string

  /**
   * @readonly
   * @property {'Exception'} name - Constructor name
   */
  readonly name: 'Exception' = 'Exception'

  /**
   * @readonly
   * @property {string} stack - Stack trace
   */
  @ApiPropertyOptional({ description: 'Stack trace', type: String })
  readonly stack?: string

  /**
   * Instantiates a new `Exception`.
   *
   * @param {ExceptionCode} [code=500] - HTTP error response status code
   * @param {NullishString} [message=Exception.DEFAULT_MESSAGE] - Error message
   * @param {ExceptionDataDTO<T> | ObjectPlain} [data={}] - Custom error data
   * @param {ExceptionCode} [data.code] - Override error response status code
   * @param {ExceptionErrors<T>} [data.errors] - Single error or group of errors
   * @param {string} [data.message] - Custom error message. Overrides `message`
   * @param {string} [stack] - Error stack
   */
  constructor(
    code: ExceptionCode = ExceptionCode.INTERNAL_SERVER_ERROR,
    message: NullishString = Exception.DEFAULT_MESSAGE,
    data: ExceptionDataDTO<T> | ObjectPlain = {},
    stack?: string
  ) {
    this.code = data.code || Exception.formatCode(code)
    this.errors = [data.errors || []].flat() as ExceptionErrors<T>
    this.id = Exception.idByCode(this.code)
    this.message = data.message || message || Exception.DEFAULT_MESSAGE
    this.stack = stack
    this.className = ExceptionClassName[this.id]
    this.data = omit(data, ['code', 'errors', 'message'])

    // If data is actually ExceptionJSON, override previously set properties
    if (isExceptionJSON(data)) {
      this.className = data.className
      this.code = data.code
      this.data = data.data
      this.errors = data.errors as ExceptionErrors<T>
      this.id = data.name
      this.message = data.message
    }
  }

  /**
   * Returns {@link ExceptionCode.INTERNAL_SERVER_ERROR} if `code` is not a
   * valid {@link ExceptionCode}.
   *
   * @param {any} [code] - Possible status code
   * @return {ExceptionCode} Exception status code
   */
  static formatCode(code?: any): ExceptionCode {
    return isExceptionCode(code) ? code : ExceptionCode.INTERNAL_SERVER_ERROR
  }

  /**
   * Transforms a {@link SequelizeError}, `error`, into an {@link Exception}.
   *
   * @template T - Sequelize error type
   *
   * @param {SequelizeError} error - Sequelize error
   * @param {ExceptionDataDTO<T> | ObjectPlain} [data={}] - Custom error data
   * @param {ExceptionCode} [data.code] - Override error response status code
   * @param {ExceptionErrors<T>} [data.errors] - Single error or group of errors
   * @param {string} [data.message] - Custom error message. Overrides `message`
   * @return {Exception<T>} New `Exception` instance
   */
  static fromSequelizeError<
    T extends SequelizeError | ValidationErrorItem = SequelizeError
  >(
    error: SequelizeError,
    data: ExceptionDataDTO<T> | ObjectPlain = {}
  ): Exception<T> {
    if (!data.errors && error['errors']) data.errors = error['errors']

    data = { error: error.name, errors: data.errors || [error], ...data }

    return new Exception<T>(
      SequelizeErrorCode[error.name],
      error.message,
      data,
      error.stack
    )
  }

  /**
   * Finds a HTTP error response status type by status code. If a type isn't
   * found, {@link ExceptionId.INTERNAL_SERVER_ERROR} will be returned.
   *
   * @param {ExceptionCode} code - HTTP error response status code
   * @return {ExceptionId} - HTTP exception type
   */
  static idByCode(code: ExceptionCode): ExceptionId {
    const id = ExceptionId.INTERNAL_SERVER_ERROR
    const ids = Object.keys(ExceptionId) as ExceptionId[]

    return ids.find(id => ExceptionCode[id] === code) || id
  }

  /**
   * Returns a JSON object representing the current Exception.
   *
   * To help identify JSON representations of {@link Exception} class objects,
   * the {@link data}  will have an `isExceptionJSON` property added.
   *
   * @return {ExceptionJSON<T>} JSON representation of exception
   */
  toJSON(): ExceptionJSON<T> {
    const json = {} as ExceptionJSON<T>

    Object.assign(json, { name: this.id })
    Object.assign(json, { message: this.message })
    Object.assign(json, { code: this.code })
    Object.assign(json, { className: this.className })
    Object.assign(json, { data: { ...this.data, isExceptionJSON: true } })
    Object.assign(json, { errors: Object.freeze(this.errors) })
    Object.assign(json, { stack: this.stack })

    return json
  }

  /**
   * Returns the exception status {@link code}.
   *
   * @return {ExceptionCode} HTTP error response status code
   */
  get status(): ExceptionCode {
    return this.code
  }
}
