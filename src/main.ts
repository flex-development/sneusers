/**
 * @file Main
 * @module sneusers/main
 */

import pkg from '#pkg' assert { type: 'json' }
import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder } from '@nestjs/swagger'
import type { Express, NextFunction, Request, Response } from 'express'
import * as http from 'node:http'
import * as https from 'node:https'
import AppModule from './app.module'
import { PaginatedDTO } from './dtos'
import { Endpoint } from './enums'
import type { IConfig } from './interfaces'
import { DocsModule } from './subdomains'

/**
 * Application runner.
 *
 * @async
 *
 * @return {Promise<NestExpressApplication>} NestJS Express application
 */
const bootstrap = async (): Promise<NestExpressApplication> => {
  /**
   * NestJS Express application.
   *
   * @const {NestExpressApplication} app
   */
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: {
      allowedHeaders: '*',
      methods: ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST'],
      optionsSuccessStatus: HttpStatus.ACCEPTED,
      origin: '*',
      preflightContinue: true
    },
    rawBody: false
  })

  /**
   * OpenAPI specification document builder.
   *
   * @see https://docs.nestjs.com/openapi/introduction#bootstrap
   *
   * @const {DocumentBuilder} documentation
   */
  const documentation: DocumentBuilder = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .setExternalDoc('GitHub Repository', pkg.homepage)
    .setLicense(pkg.license, pkg.homepage + '/blob/main/LICENSE.md')

  // redirect /api to documentation endpoint
  app.use((req: Request, res: Response, next: NextFunction): void => {
    return req.path === '/api'
      ? void res.redirect(HttpStatus.PERMANENT_REDIRECT, Endpoint.DOCS)
      : void next()
  })

  // configure openapi endpoints
  DocsModule.setup(
    '/api',
    app,
    DocsModule.createDocument(app, documentation.build(), {
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
    }),
    {
      jsonDocumentUrl: '/api/json',
      useGlobalPrefix: false,
      yamlDocumentUrl: '/api/yaml'
    }
  )

  // initialize nest application
  await app.init()

  /**
   * Configuration service.
   *
   * @const {ConfigService<IConfig, true>} config
   */
  const config: ConfigService<IConfig, true> = app.get(ConfigService)

  /**
   * Underlying request listener.
   *
   * @const {Express} listener
   */
  const listener: Express = app.getHttpAdapter().getInstance()

  /**
   * HTTPS server options.
   *
   * @const {https.ServerOptions} https_options
   */
  const https_options: https.ServerOptions = {
    cert: config.get<string>('HTTPS_CERT'),
    key: config.get<string>('HTTPS_KEY')
  }

  // start servers
  http.createServer(listener).listen(80)
  https.createServer(https_options, listener).listen(443)

  return app
}

export default await bootstrap()
