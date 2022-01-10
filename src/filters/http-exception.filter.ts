import type { ObjectPlain } from '@flex-development/tutils'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Exception } from '@sneusers/exceptions'
import type { EnvironmentVariables } from '@sneusers/models'
import type { Response } from 'express'

/**
 * @file Filters - HttpExceptionFilter
 * @module sneusers/filters/HttpExceptionFilter
 */

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

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

    const payload = new Exception(status, undefined, data).toJSON()

    if (!this.config.get<boolean>('PROD') && !payload.stack) {
      payload.stack = exception.stack
    }

    return res.status(payload.code).json(payload).end()
  }
}