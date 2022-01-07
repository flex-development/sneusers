import type { ObjectPlain } from '@flex-development/tutils'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import type { Response } from 'express'

/**
 * @file Filters - HttpExceptionFilter
 * @module sneusers/filters/HttpExceptionFilter
 */

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Transforms `exception`, a {@link HttpException}, into an {@link Exception}.
   *
   * An `ExceptionJSON` object will be returned to the client.
   *
   * @param {HttpException} exception - Exception thrown
   * @param {ArgumentsHost} host - Methods for retrieving handler arguments
   * @return {void} Nothing when complete
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    const data: ObjectPlain = { message: exception.message }
    const response = exception.getResponse() as ObjectPlain
    const status = exception.getStatus()
    const type = exception.constructor.name

    if (type === 'BadRequestException') data.errors = response.message
    if (typeof response === 'string') data.message = response

    res.status(status).json(new Exception(status, '', data).toJSON())
    return res.end()
  }
}
