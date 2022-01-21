import type { ExceptionData } from '@flex-development/exceptions/types'
import type { OneOrMany } from '@flex-development/tutils'
import type { ExceptionCode } from '@sneusers/enums'

/**
 * @file Data Transfer Objects - ExceptionDataDTO
 * @module sneusers/dtos/ExceptionDataDTO
 */

/**
 * Custom `Exception` data.
 *
 * @template T - Aggregated error type
 */
interface ExceptionDataDTO<T = any> extends ExceptionData {
  code?: ExceptionCode
  errors?: OneOrMany<T>
  message?: string
}

export default ExceptionDataDTO
