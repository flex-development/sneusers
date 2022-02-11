import { ExceptionCode } from '@flex-development/exceptions/enums'
import {
  ArgumentsHost,
  Catch,
  ClassProvider,
  ExceptionFilter
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { Exception } from '@sneusers/exceptions'
import type { EnvironmentVariables } from '@sneusers/models'
import type { Response } from 'express'
import { isHttpError } from 'http-errors'

/**
 * @file Filters - ErrorFilter
 * @module sneusers/filters/ErrorFilter
 */

@Catch()
class ErrorFilter implements ExceptionFilter {
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
   * @return {ClassProvider<ErrorFilter>} Application filter
   */
  static createProvider(): ClassProvider<ErrorFilter> {
    return { provide: APP_FILTER, useClass: ErrorFilter }
  }

  /**
   * Transforms `error`, a {@link Error}, into an {@link Exception}.
   *
   * An `ExceptionJSON` object will be returned to the client.
   *
   * @param {Error} error - Exception thrown
   * @param {ArgumentsHost} host - Methods for retrieving handler arguments
   * @return {void} Nothing when complete
   */
  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    const data: ExceptionDataDTO = {}
    let code: ExceptionCode | undefined

    if (isHttpError(error)) {
      code = error.status as ExceptionCode
      data.headers = error.headers
    }

    const exception = new Exception(code, error.message, data, error.stack)
    const payload = exception.toJSON()

    if (this.config.get<boolean>('PROD')) {
      Reflect.deleteProperty(payload, 'stack')
      Reflect.deleteProperty(payload.data, 'isExceptionJSON')
    }

    return res.status(payload.code).json(payload).end()
  }
}

export default ErrorFilter
