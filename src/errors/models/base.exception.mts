/**
 * @file Errors - Exception
 * @module sneusers/errors/Exception
 */

import ExceptionCode from '#errors/enums/exception-code'
import ExceptionId from '#errors/enums/exception-id'
import type {
  ExceptionInfo,
  ExceptionJson,
  Reason
} from '@flex-development/sneusers/errors'
import type { JsonObject } from '@flex-development/sneusers/types'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'
import { ok } from 'devlop'

/**
 * API exception model.
 *
 * @class
 * @extends {Error}
 */
@ApiSchema()
class Exception extends Error {
  /**
   * The {@linkcode reason} for the exception, if any, as a JSON object.
   *
   * @public
   * @instance
   * @override
   * @member {JsonObject | null} cause
   */
  public override cause: JsonObject | null

  /**
   * The suggested HTTP response status code.
   *
   * @public
   * @instance
   * @member {ExceptionCode} code
   */
  @ApiProperty({
    description: 'http response status code',
    enum: ExceptionCode
  })
  public code: ExceptionCode

  /**
   * Unique id representing the exception.
   *
   * @public
   * @instance
   * @member {ExceptionId} id
   */
  @ApiProperty({
    description: 'unique id representing the exception',
    enum: ExceptionId
  })
  public id: ExceptionId

  /**
   * Human-readable description of the exception.
   *
   * @public
   * @instance
   * @member {string} id
   */
  @ApiProperty({
    description: 'human-readable description of the exception',
    type: 'string'
  })
  declare public message: string

  /**
   * The reason for the exception.
   *
   * @public
   * @instance
   * @member {Reason | null} reason
   */
  public reason: Reason | null

  /**
   * When the exception occurred.
   *
   * @public
   * @instance
   * @member {number} timestamp
   */
  public timestamp: number

  /**
   * Create a new exception.
   *
   * @param {ExceptionInfo} info
   *  Info about the exception
   * @param {ExceptionCode} info.code
   *  Suggested HTTP response status code
   * @param {ExceptionId} info.id
   *  Unique id representing the exception
   * @param {string} info.message
   *  Human-readable description of the exception
   * @param {Reason | null | undefined} [info.reason]
   *  The reason for the exception
   */
  constructor(info: ExceptionInfo)

  /**
   * Create a new exception.
   *
   * @param {ExceptionCode} code
   *  Suggested HTTP response status code
   * @param {ExceptionId} id
   *  Unique id representing the exception
   * @param {string} message
   *  Human-readable description of the exception
   * @param {Reason | null | undefined} [reason]
   *  The reason for the exception
   */
  constructor(
    code: ExceptionCode,
    id: ExceptionId,
    message: string,
    reason?: Reason | null | undefined
  )

  /**
   * Create a new exception.
   *
   * @param {ExceptionCode | ExceptionInfo} info
   *  Error info or suggested HTTP response status code
   * @param {ExceptionId | undefined} [id]
   *  Unique id representing the exception
   * @param {string | undefined} [message]
   *  Human-readable description of the exception
   * @param {Reason | null | undefined} [reason]
   *  The reason for the exception
   */
  constructor(
    info: ExceptionCode | ExceptionInfo,
    id?: ExceptionId | undefined,
    message?: string | undefined,
    reason?: Reason | null | undefined
  ) {
    if (typeof info === 'number') {
      ok(typeof id === 'string', 'expected `id`')
      ok(typeof message === 'string', 'expected `message`')

      info = { code: info, id, message, reason }
    }

    super(info.message)
    Error.captureStackTrace(this, this.constructor)

    this.name = 'Exception'
    this.code = info.code
    this.id = info.id

    this.reason = info.reason ?? null
    this.cause = this.reason?.toJSON() ?? null

    this.timestamp = Date.now()
  }

  /**
   * Get the exception as a JSON object.
   *
   * @public
   * @instance
   *
   * @return {ExceptionJson}
   *  JSON representation of `this` exception
   */
  public toJSON(): ExceptionJson {
    return {
      code: this.code,
      id: this.id,
      message: this.message,
      reason: this.cause
    }
  }
}

export default Exception
