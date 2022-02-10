import type { ObjectPlain } from '@flex-development/tutils'
import { ANY } from '@flex-development/tutils'
import { HttpModuleOptionsFactory } from '@nestjs/axios'
import {
  HttpModuleAsyncOptions,
  HttpModuleOptions,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common'
import { AXIOS_INSTANCE } from '@sneusers/config/provider-tokens.config'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

/**
 * @file Providers - HttpConfigService
 * @module sneusers/providers/HttpConfigService
 */

@Injectable()
export default class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(@Inject(AXIOS_INSTANCE) protected readonly axios: AxiosInstance) {
    axios.interceptors.response.use(
      HttpConfigService.onFulfilled,
      HttpConfigService.onRejected
    )
  }

  /**
   * Get `HttpModule` configuration options.
   *
   * @static
   * @return {HttpModuleAsyncOptions} Module options
   */
  static get moduleOptions(): HttpModuleAsyncOptions {
    return { useClass: HttpConfigService }
  }

  /**
   * Returns the data from a successful http request.
   *
   * @template T - Response data type
   * @template D - Request data type
   *
   * @static
   * @param {AxiosResponse<T, D>} response - Axios response
   * @param {T} response.data - Response data
   * @return {T | AxiosResponse<T, D>} Response data or response
   */
  static onFulfilled<T extends ANY = ANY, D extends ANY = ANY>(
    response: AxiosResponse<T, D>
  ): T | AxiosResponse<T, D> {
    return response.data || response
  }

  /**
   * Converts an http error into an {@link Exception}.
   *
   * @template T - Aggregated error type
   *
   * @static
   * @param {AxiosError} error - HTTP error to transform
   * @return {Exception<AxiosError>} New exception
   */
  static onRejected<T = AxiosError>(error: AxiosError): Exception<T> {
    const { isAxiosError = true, message, request, response, stack } = error

    // request was made and error response received was ExceptionJSON
    if (response?.data?.data?.isExceptionJSON) {
      response.data.data.data.isAxiosError = isAxiosError
      return new Exception<T>(response.status, message, response.data, stack)
    }

    // get error details
    const {
      auth,
      baseURL,
      cancelToken,
      data: payload,
      headers,
      method,
      params,
      proxy,
      responseType,
      status,
      timeout,
      transitional,
      url,
      withCredentials
    } = error.toJSON() as ObjectPlain

    // initial exception code
    let code: ExceptionCode = status || ExceptionCode.INTERNAL_SERVER_ERROR

    // base exception data
    let data: ExceptionDataDTO<AxiosError> = {
      auth,
      baseURL,
      cancelToken: cancelToken ? { reason: cancelToken.reason } : undefined,
      data: payload,
      errors: [error],
      headers,
      isAxiosError,
      method,
      params,
      proxy,
      responseType,
      timeout,
      transitional,
      url,
      withCredentials
    }

    // request was made and unrecognized error response was received
    if (response) {
      const { headers, data: payload, status } = response

      code = status

      data = {
        ...data,
        headers,
        message: typeof payload === 'string' ? payload : payload?.message,
        payload
      }
    }

    // request was made, but no response was received
    if (!request) data = { ...data, message: 'No response received.' }
    else {
      data.request = {
        aborted: request.aborted,
        code: request.code,
        host: request.host,
        path: request.path,
        protocol: request.protocol
      }
    }

    return new Exception<T>(code, message, data, stack)
  }

  /**
   * Get http client configuration options.
   *
   * @return {HttpModuleOptions} HTTP client options
   */
  createHttpOptions(): HttpModuleOptions {
    return {
      /**
       * Defines whether to resolve or reject the promise for a given HTTP
       * response status code.
       *
       * @param {HttpStatus} status - HTTP response status code
       * @return {boolean} `true` to resolve, `false` to reject
       */
      validateStatus(status: number): boolean {
        return !Object.values(ExceptionCode).includes(status)
      },
      xsrfCookieName: 'CSRF-TOKEN',
      xsrfHeaderName: 'X-CSRF-TOKEN'
    }
  }
}
