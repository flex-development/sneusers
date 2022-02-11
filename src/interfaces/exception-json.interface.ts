import { ExceptionJSON as EJSON } from '@flex-development/exceptions/interfaces'
import type { ExceptionData } from '@sneusers/types'

/**
 * @file Interfaces - ExceptionJSON
 * @module sneusers/interfaces/ExceptionJSON
 */

/**
 * JSON representation of an `Exception`.
 *
 * @template T - Aggregate error type
 *
 * @extends {Omit<EJSON<T>, 'data'>}
 */
interface ExceptionJSON<T = any> extends Omit<EJSON<T>, 'data'> {
  data: ExceptionData & { isExceptionJSON: true }
  stack?: string
}

export default ExceptionJSON
