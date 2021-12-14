import type { INestApplication } from '@nestjs/common'
import type { SwaggerDocumentOptions } from '@nestjs/swagger'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { Request as Req, Response as Res } from 'express'
import { PACKAGE } from './config/constants.config'

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
  // Initialize documentation builder
  const builder = new DocumentBuilder()

  // Get package data
  const { bugs, description, homepage, license, name, version } = PACKAGE
  const { 0: org = '', 1: name_no_org = '' } = name.split('/')

  // Set basic info
  builder.setContact(org, bugs, undefined as unknown as string)
  builder.setDescription(description)
  builder.setExternalDoc('GitHub Repository', homepage)
  builder.setLicense(license, undefined as unknown as string)
  builder.setTitle(name_no_org)
  builder.setVersion(version)

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
