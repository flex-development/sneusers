import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import type { Response } from 'express'

/**
 * @file Filters - ExceptionClassFilter
 * @module sneusers/filters/ExceptionClassFilter
 */

@Catch(Exception)
export default class ExceptionClassFilter implements ExceptionFilter {
  /**
   * Creates a JSON representation of `exception`.
   *
   * An `ExceptionJSON` object will be returned to the client.
   *
   * @param {Exception} exception - Exception thrown
   * @param {ArgumentsHost} host - Methods for retrieving handler arguments
   * @return {void} Nothing when complete
   */
  catch(exception: Exception, host: ArgumentsHost): void {
    const payload = exception.toJSON()
    const res = host.switchToHttp().getResponse<Response>()

    Reflect.deleteProperty(payload.data, 'isExceptionJSON')
    Reflect.deleteProperty(payload.data.options, 'plain')
    Reflect.deleteProperty(payload.data.options, 'rejectOnEmpty')
    Reflect.deleteProperty(payload.data.options, 'transaction')

    return res.status(payload.code).json(payload).end()
  }
}
