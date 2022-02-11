import type { ExceptionCode } from '@flex-development/exceptions/enums'
import { ExceptionData } from '@flex-development/exceptions/types'
import type { OneOrMany } from '@flex-development/tutils'

/**
 * @file Data Transfer Objects - ExceptionDataDTO
 * @module sneusers/dtos/ExceptionDataDTO
 */

/**
 * Custom `Exception` data.
 *
 * @template T - Aggregated error type
 *
 * @extends ExceptionData
 */
interface ExceptionDataDTO<T = any> extends ExceptionData {
  code?: ExceptionCode
  errors?: OneOrMany<T>
  message?: string
}

export default ExceptionDataDTO
