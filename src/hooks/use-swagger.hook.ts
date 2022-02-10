import type { NestExpressApplication } from '@nestjs/platform-express'
import type { SwaggerDocumentOptions } from '@nestjs/swagger'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ENV } from '@sneusers/config/configuration'
import { PaginatedDTO } from '@sneusers/dtos'
import { ApiEndpoint } from '@sneusers/enums'
import { QueryParams } from '@sneusers/models'
import { AppService } from '@sneusers/providers'
import type { Request, Response } from 'express'
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
 * @param {NestExpressApplication} app - NestJS application
 * @param {string} [path=''] - Path to serve documentation from
 * @return {Promise<NestExpressApplication>} Promise containing enhanced `app`
 */
const useSwagger = async (
  app: NestExpressApplication,
  path: string = ''
): Promise<NestExpressApplication> => {
  // Initialize documentation builder
  const builder = new DocumentBuilder()

  // Get package data
  const pkg = AppService.package

  // Set basic info
  builder.setContact(pkg.org, pkg.bugs, undefined as unknown as string)
  builder.setDescription(pkg.description)
  builder.setExternalDoc('GitHub Repository', pkg.homepage)
  builder.setLicense(pkg.license, undefined as unknown as string)
  builder.setTitle(`[${ENV.APP_ENV}] ${pkg.app}`)
  builder.setVersion(pkg.version)

  // Add security schemes
  builder.addBearerAuth({
    bearerFormat: 'JWT',
    description: 'User access token',
    scheme: 'bearer',
    type: 'http'
  })
  builder.addCookieAuth('Refresh', {
    description: 'User refresh token',
    name: 'Refresh',
    type: 'http'
  })

  // Add tags
  builder.addTag(ApiEndpoint.AUTH, 'User authentication')
  builder.addTag(ApiEndpoint.USERS, 'Create, find, update, and remove users')
  builder.addTag(ApiEndpoint.HEALTH, 'Healthchecks', {
    description: 'NestJS Docs - Healthchecks (Terminus)',
    url: 'https://docs.nestjs.com/recipes/terminus'
  })

  // Add servers
  builder.addServer(ENV.SERVER_URL_PROD, ENV.SERVER_DESCRIP_PROD)
  builder.addServer(ENV.SERVER_URL_STG, ENV.SERVER_DESCRIP_STG)
  builder.addServer(ENV.SERVER_URL_DEV, ENV.SERVER_DESCRIP_DEV)

  // Get documentation options
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
    extraModels: [PaginatedDTO, QueryParams],
    ignoreGlobalPrefix: false,
    operationIdFactory(controllerKey: string, methodKey: string): string {
      return `${controllerKey}#${methodKey}`
    }
  }

  // Get documentation in OpenAPI format
  const docs = SwaggerModule.createDocument(app, builder.build(), options)

  // Add handler to view docs from path
  app.getHttpAdapter().get(path, (req: Request, res: Response) => {
    docs.components!.schemas = sortObject(docs.components!.schemas)

    res.json({
      openapi: docs.openapi,
      info: docs.info,
      servers: docs.servers,
      security: docs.security,
      tags: docs.tags!.sort((t1, t2) => t1.name.localeCompare(t2.name)),
      externalDocs: docs.externalDocs,
      paths: sortObject(docs.paths),
      components: docs.components
    })

    return res.end()
  })

  return app
}

export default useSwagger
