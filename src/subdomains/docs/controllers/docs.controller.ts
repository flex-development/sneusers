/**
 * @file Controllers - DocsController
 * @module sneusers/subdomains/docs/controllers/Docs
 */

import { Endpoint } from '#src/enums'
import { RXJS } from '#src/tokens'
import { HttpService } from '@nestjs/axios'
import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common'
import { ApiExcludeController, type OpenAPIObject } from '@nestjs/swagger'
import type { AxiosResponse } from 'axios'
import { get } from 'radash'
import type * as RxJS from 'rxjs'

/**
 * API documentation controller.
 *
 * @class
 */
@Controller(Endpoint.DOCS)
@ApiExcludeController()
class DocsController {
  /**
   * Creates a new API documentation controller.
   *
   * @param {HttpService} http - HTTP request service
   * @param {typeof RxJS} rxjs - Reactive extensions library
   */
  constructor(
    @Inject(HttpService) private readonly http: HttpService,
    @Inject(RXJS) private readonly rxjs: typeof RxJS
  ) {}

  /**
   * Returns an OpenAPI specification object.
   *
   * @public
   * @async
   *
   * @return {Promise<OpenAPIObject>} OpenAPI specification object
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  public async get(): Promise<OpenAPIObject> {
    const { firstValueFrom } = this.rxjs
    return get<AxiosResponse<OpenAPIObject>, OpenAPIObject>(
      await firstValueFrom(this.http.get<OpenAPIObject>('/api/json')),
      'data'
    )!
  }
}

export default DocsController
