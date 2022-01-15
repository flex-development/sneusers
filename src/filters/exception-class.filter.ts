import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Exception } from '@sneusers/exceptions'
import type { EnvironmentVariables } from '@sneusers/models'
import type { Response } from 'express'
import isPlainObject from 'lodash.isplainobject'

/**
 * @file Filters - ExceptionClassFilter
 * @module sneusers/filters/ExceptionClassFilter
 */

@Catch(Exception)
export default class ExceptionClassFilter implements ExceptionFilter {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

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

    if (isPlainObject(payload.data.options)) {
      Reflect.deleteProperty(payload.data.options, 'plain')
      Reflect.deleteProperty(payload.data.options, 'rejectOnEmpty')
      Reflect.deleteProperty(payload.data.options, 'transaction')
    }

    if (this.config.get<boolean>('PROD')) {
      Reflect.deleteProperty(payload, 'stack')
      Reflect.deleteProperty(payload.data, 'isExceptionJSON')
    }

    return res.status(payload.code).json(payload).end()
  }
}
