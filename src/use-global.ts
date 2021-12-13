import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SwaggerDocumentOptions } from '@nestjs/swagger'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { Request as Req, Response as Res } from 'express'
import { EnvironmentVariables as EnvVars } from './models'

/**
 * @file Server Configuration - useGlobal
 * @module sneusers/useGlobal
 */

/**
 * Configures `app` to serve [API][1] documentation from the root endpoint, `/`,
 * as well as applies global filters, guards, interceptors, pipes, and prefixes.
 *
 * [1]: https://docs.nestjs.com/openapi/introduction
 *
 * @see https://docs.nestjs.com/exception-filters
 * @see https://docs.nestjs.com/guards
 * @see https://docs.nestjs.com/interceptors
 * @see https://docs.nestjs.com/pipes
 * @see https://docs.nestjs.com/faq/global-prefix
 *
 * @async
 * @param {INestApplication} app - NestJS application
 * @return {Promise<INestApplication>} Promise containing enhanced `app`
 */
const useGlobal = async (app: INestApplication): Promise<INestApplication> => {
  // Get app configuration service
  const config = app.get<ConfigService<EnvVars, true>>(ConfigService)

  // Get environment variables
  const DESCRIPTION = config.get<EnvVars['DESCRIPTION']>('DESCRIPTION')
  const TITLE = config.get<EnvVars['TITLE']>('TITLE')
  const VERSION = config.get<EnvVars['VERSION']>('VERSION')

  // Initialize documentation builder
  const builder = new DocumentBuilder()

  // Set info.description, info.title, and info.version
  builder.setDescription(DESCRIPTION)
  builder.setTitle(TITLE)
  builder.setVersion(VERSION)

  // Get documentation options
  const options: SwaggerDocumentOptions = {
    extraModels: []
  }

  // Get documentation in OpenAPI format
  const docs = SwaggerModule.createDocument(app, builder.build(), options)

  // Add handler to view docs from root endpoint
  app.getHttpAdapter().get('', (req: Req, res: Res) => res.json(docs))

  return app
}

export default useGlobal
