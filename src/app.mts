/**
 * @file app
 * @module sneusers/app
 */

import useSwagger from '#hooks/use-swagger.hook'
import AppModule from '#modules/app.module'
import { ConsoleLogger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  type NestFastifyApplication
} from '@nestjs/platform-fastify'
import type { FastifyReply } from 'fastify'

export default app

/**
 * Create a NestJS application.
 *
 * @see {@linkcode NestFastifyApplication}
 * @see https://fastify.dev
 *
 * @todo versioning
 *
 * @async
 *
 * @this {void}
 *
 * @return {Promise<NestFastifyApplication>}
 *  NestJS x Fastify application
 */
async function app(this: void): Promise<NestFastifyApplication> {
  /**
   * The NestJS application.
   *
   * @const {NestFastifyApplication} app
   */
  const app: NestFastifyApplication = await NestFactory.create(
    AppModule,
    new FastifyAdapter(),
    {
      abortOnError: false,
      logger: new ConsoleLogger({ logLevels: ['verbose'], prefix: 'nest' })
    }
  )

  // decorate the fastify response object.
  app
    .getHttpAdapter()
    .getInstance()
    .decorateReply('end', end) // required for @nestjs/passport
    .decorateReply('setHeader', setHeader) // required for @nestjs/passport

  // configure openapi documentation endpoints.
  useSwagger(app)

  return app
}

/* v8 ignore start */

/**
 * Signal that no more data will be written.
 *
 * @this {FastifyReply}
 *
 * @return {undefined}
 */
function end(this: FastifyReply): undefined {
  return void this.raw.end()
}

/**
 * Set a single header value.
 *
 * If the header already exists in the to-be-sent headers, its value will be
 * replaced.
 * Use an array of strings to send multiple headers with the same name.
 *
 * @this {FastifyReply}
 *
 * @param {string} key
 *  The header name
 * @param {ReadonlyArray<string> | number | string} value
 *  The header value
 * @return {undefined}
 */
function setHeader(
  this: FastifyReply,
  key: string,
  value: number | string | readonly string[]
): undefined {
  return void this.raw.setHeader(key, value)
}

/* v8 ignore end */
