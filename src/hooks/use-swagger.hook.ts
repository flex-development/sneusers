import type { INestApplication } from '@nestjs/common'
import type { SwaggerDocumentOptions } from '@nestjs/swagger'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PACKAGE } from '@sneusers/config/constants.config'
import { QueryParams } from '@sneusers/models'
import type { Request as Req, Response as Res } from 'express'
import sortObject from 'sort-object-keys'

/**
 * @file Hooks - useSwagger
 * @module sneusers/hooks/useSwagger
 */

/**
 * Configures `app` to serve [API][1] documentation from `path`.
 *
 * [1]: https://docs.nestjs.com/openapi/introduction
 *
 * @async
 * @param {INestApplication} app - NestJS application
 * @param {string} [path=''] - Path to serve documentation from
 * @return {Promise<INestApplication>} Promise containing enhanced `app`
 */
const useSwagger = async (
  app: INestApplication,
  path: string = ''
): Promise<INestApplication> => {
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

  // Add tags
  builder.addTag('auth', 'Authentication and Authorization')
  builder.addTag('users', 'Create, find, update, and remove users')
  builder.addTag('health', 'Healthchecks', {
    description: 'NestJS Docs - Healthchecks (Terminus)',
    url: 'https://docs.nestjs.com/recipes/terminus'
  })

  // Get documentation options
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
    extraModels: [QueryParams],
    ignoreGlobalPrefix: false,
    operationIdFactory(controllerKey: string, methodKey: string): string {
      return `${controllerKey}#${methodKey}`
    }
  }

  // Get documentation in OpenAPI format
  const docs = SwaggerModule.createDocument(app, builder.build(), options)

  // Sort docs
  docs.components!.schemas = sortObject(docs.components!.schemas)

  // Add handler to view docs from path
  app.getHttpAdapter().get(path, (req: Req, res: Res) => {
    res.json({
      openapi: docs.openapi,
      info: docs.info,
      servers: docs.servers,
      tags: docs.tags,
      security: docs.security,
      externalDocs: docs.externalDocs,
      paths: sortObject(docs.paths),
      components: sortObject(docs.components)
    })

    return res.end()
  })

  return app
}

export default useSwagger
