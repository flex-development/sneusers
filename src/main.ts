/**
 * @file Main
 * @module sneusers/main
 */

import type { ObjectPlain } from '@flex-development/tutils'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import {
  DocumentBuilder,
  SwaggerModule,
  type OpenAPIObject
} from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { set } from 'radash'
import sortKeys from 'sort-keys'
import pkg from '../package.json'
import AppModule from './app.module'
import { PaginatedDTO } from './dtos'
import type { EnvironmentVariables } from './models'
import { AppService } from './providers'

/**
 * Bootstraps the NestJS application.
 *
 * @async
 *
 * @return {Promise<void>} Nothing when complete
 */
const bootstrap = async (): Promise<void> => {
  /**
   * NestJS application.
   *
   * @const {NestExpressApplication} app
   */
  const app: NestExpressApplication = await NestFactory.create(
    AppModule,
    AppService.options
  )

  /**
   * Configuration service instance.
   *
   * @const {ConfigService<EnvironmentVariables, true>} config
   */
  const config: ConfigService<EnvironmentVariables, true> =
    app.get(ConfigService)

  /**
   * Documentation builder.
   *
   * @see https://docs.nestjs.com/openapi/introduction
   *
   * @const {DocumentBuilder} documentation
   */
  const documentation: DocumentBuilder = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .setExternalDoc('GitHub Repository', pkg.homepage)
    .setLicense(pkg.license, pkg.homepage + '/blob/main/LICENSE.md')

  /**
   * OpenAPI documentation object.
   *
   * @const {OpenAPIObject} openapi
   */
  const openapi: OpenAPIObject = SwaggerModule.createDocument(
    app,
    documentation.build(),
    {
      deepScanRoutes: true,
      extraModels: [PaginatedDTO],
      ignoreGlobalPrefix: false,
      /**
       * Generates an [`operationId`][1].
       *
       * [1]: https://swagger.io/docs/specification/paths-and-operations/
       *
       * @param {string} controller - Controller name
       * @param {string} method - Controller method name
       * @return {string} Custom operation id
       */
      operationIdFactory(controller: string, method: string): string {
        return `${controller}#${method}`
      }
    }
  )

  /** trust proxy: @see https://expressjs.com/guide/behind-proxies.html */
  app.enable('trust proxy')

  // add handler to view docs from root path
  app.getHttpAdapter().get('', (req: Request, res: Response) => {
    const {
      components = {},
      externalDocs = {},
      info = {},
      paths = {},
      security = {},
      servers = [],
      tags = []
    } = openapi

    /**
     * Response body.
     *
     * @var {ObjectPlain} body
     */
    let body: ObjectPlain = {}

    body = set(body, 'openapi', openapi.openapi)
    body = set(body, 'info', info)
    body = set(body, 'servers', servers)
    body = set(body, 'security', security)
    body = set(body, 'tags', tags)
    body = set(body, 'externalDocs', externalDocs)
    body = set(body, 'paths', paths)
    body = set(body, 'components', sortKeys(components, { deep: true }))

    res.json(body)
    return res.end()
  })

  return void (await app.listen(config.get<number>('PORT')))
}

void (await bootstrap())
