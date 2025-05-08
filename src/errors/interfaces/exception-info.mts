/**
 * @file Interfaces - ExceptionInfo
 * @module sneusers/errors/interfaces/ExceptionInfo
 */

import type {
  ExceptionCode,
  ExceptionId,
  Reason
} from '@flex-development/sneusers/errors'

/**
 * Data used to create API exceptions.
 */
interface ExceptionInfo {
  /**
   * The suggested HTTP response status code.
   */
  code: ExceptionCode

  /**
   * Unique id representing the error.
   */
  id: ExceptionId

  /**
   * Human-readable description of the error.
   */
  message: string

  /**
   * The reason for the exception.
   */
  reason?: Reason | null | undefined
}

export type { ExceptionInfo as default }
