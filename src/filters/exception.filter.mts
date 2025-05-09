/**
 * @file Filters - ExceptionFilter
 * @module sneusers/filters/ExceptionFilter
 */

import { Exception } from '@flex-development/sneusers/errors'
import {
  Catch,
  type ArgumentsHost,
  type ExceptionFilter as IExceptionFilter
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'

/**
 * API exception filter.
 *
 * @class
 * @implements {IExceptionFilter<Exception>}
 */
@Catch(Exception)
class ExceptionFilter implements IExceptionFilter<Exception> {
  /**
   * Send an exception response.
   *
   * @public
   * @instance
   *
   * @param {Exception} e
   *  The exception to handle
   * @param {ArgumentsHost} host
   *  Methods for retrieving arguments passed to execution context handler
   * @return {undefined}
   */
  public catch(e: Exception, host: ArgumentsHost): undefined {
    return void host.switchToHttp()
      .getResponse<FastifyReply>()
      .header('content-type', 'application/json')
      .status(e.code)
      .send(e.toJSON())
  }
}

export default ExceptionFilter
