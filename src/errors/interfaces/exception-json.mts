/**
 * @file Interfaces - ExceptionJson
 * @module sneusers/errors/interfaces/ExceptionJson
 */

import type {
  ExceptionCode,
  ExceptionId
} from '@flex-development/sneusers/errors'
import type { JsonObject } from '@flex-development/sneusers/types'

/**
 * [JSON][] representation of an API exception.
 *
 * [json]: https://restfulapi.net/json-data-typesx
 *
 * @extends {JsonObject}
 */
interface ExceptionJson extends JsonObject {
  /**
   * HTTP response status code.
   */
  code: ExceptionCode

  /**
   * Unique id representing the exception.
   */
  id: ExceptionId

  /**
   * Human-readable description of the exception.
   */
  message: string

  /**
   * The reason for the exception.
   */
  reason: JsonObject | null
}

export type { ExceptionJson as default }
