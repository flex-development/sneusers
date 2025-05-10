/**
 * @file Filters - UnauthorizedExceptionFilter
 * @module sneusers/accounts/filters/UnauthorizedException
 */

import {
  InvalidCredentialException
} from '@flex-development/sneusers/accounts/errors'
import { ExceptionCode } from '@flex-development/sneusers/errors'
import {
  Catch,
  UnauthorizedException,
  type ArgumentsHost,
  type ExceptionFilter as IExceptionFilter
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'

/**
 * Unauthorized exception filter.
 *
 * @class
 * @implements {IExceptionFilter<UnauthorizedException>}
 */
@Catch(UnauthorizedException)
class UnauthorizedExceptionFilter
  implements IExceptionFilter<UnauthorizedException> {
  /**
   * Send an invalid credential exception response.
   *
   * @public
   * @instance
   *
   * @param {UnauthorizedException} e
   *  The error to handle
   * @param {ArgumentsHost} host
   *  Methods for retrieving arguments passed to execution context handler
   * @return {undefined}
   */
  public catch(e: UnauthorizedException, host: ArgumentsHost): undefined {
    return void host.switchToHttp()
      .getResponse<FastifyReply>()
      .header('content-type', 'application/json')
      .status(ExceptionCode.UNAUTHORIZED)
      .send(new InvalidCredentialException().toJSON())
  }
}

export default UnauthorizedExceptionFilter
