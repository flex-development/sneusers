import type { ObjectPlain, OneOrMany } from '@flex-development/tutils'

/**
 * @file Type Definitions - InterceptorResponse
 * @module sneusers/types/InterceptorResponse
 */

/**
 * Type of value wrapped by an interceptor observable.
 *
 * @template T - Data type
 */
type InterceptorResponse<T = ObjectPlain> = OneOrMany<T> | void

export default InterceptorResponse
