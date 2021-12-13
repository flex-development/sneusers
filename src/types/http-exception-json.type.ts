import { ExceptionCode } from '@flex-development/exceptions/enums'

/**
 * @file Type Definitions - HttpExceptionJSON
 * @module sneusers/types/HttpExceptionJSON
 */

/**
 * JSON response from an `HttpException`.
 */
type HttpExceptionJSON = {
  message: string
  statusCode: ExceptionCode
}

export default HttpExceptionJSON
