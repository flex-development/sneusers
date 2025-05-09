/**
 * @file Filters - UnhandledExceptionFilter
 * @module sneusers/filters/UnhandledExceptionFilter
 */

import {
  ExceptionCode,
  InternalServerException
} from '@flex-development/sneusers/errors'
import {
  Catch,
  type ArgumentsHost,
  type ExceptionFilter as IExceptionFilter
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'

/**
 * Unhandled error filter.
 *
 * @class
 * @implements {IExceptionFilter<Error>}
 */
@Catch()
class UnhandledExceptionFilter implements IExceptionFilter<Error> {
  /**
   * Send an internal server exception response.
   *
   * @public
   * @instance
   *
   * @param {Error} e
   *  The error to handle
   * @param {ArgumentsHost} host
   *  Methods for retrieving arguments passed to execution context handler
   * @return {undefined}
   */
  public catch(e: Error, host: ArgumentsHost): undefined {
    return void host.switchToHttp()
      .getResponse<FastifyReply>()
      .header('content-type', 'application/json')
      .status(ExceptionCode.INTERNAL_SERVER_ERROR)
      .send(new InternalServerException(e).toJSON())
  }
}

export default UnhandledExceptionFilter
