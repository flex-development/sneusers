import type { ObjectPlain, OneOrMany } from '@flex-development/tutils'

/**
 * @file Data Transfer Objects - InterceptorDTO
 * @module sneusers/dtos/InterceptorDTO
 */

/**
 * Type of value wrapped by an interceptor observable.
 *
 * @template T - Data type
 */
type InterceptorDTO<T = ObjectPlain> = OneOrMany<T> | void

export default InterceptorDTO
