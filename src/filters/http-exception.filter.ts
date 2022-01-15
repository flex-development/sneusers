import type { ObjectPlain } from '@flex-development/tutils'
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ClassProvider,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
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
   * Returns a global-scoped application filter.
   *
   * Use this custom provider instead of `useGlobalFilters` to enable depedency
   * injection for this class.
   *
   * @see https://docs.nestjs.com/exception-filters#binding-filters
   *
   * @static
   * @return {ClassProvider<HttpExceptionFilter>} Application filter
   */
  static get PROVIDER(): ClassProvider<HttpExceptionFilter> {
    return { provide: APP_FILTER, useClass: HttpExceptionFilter }
  }

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

    if (exception instanceof BadRequestException) data.errors = response.message
    if (typeof response === 'string') data.message = response

    const payload = new Exception(status, '', data, exception.stack).toJSON()

    if (this.config.get<boolean>('PROD')) {
      Reflect.deleteProperty(payload, 'stack')
      Reflect.deleteProperty(payload.data, 'isExceptionJSON')
    }

    return res.status(payload.code).json(payload).end()
  }
}
