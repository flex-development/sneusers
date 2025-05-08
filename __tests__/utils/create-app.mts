/**
 * @file Test Utilities - createApp
 * @module tests/utils/createApp
 */

import {
  FastifyAdapter,
  type NestFastifyApplication
} from '@nestjs/platform-fastify'
import type { TestingModule } from '@nestjs/testing'

/**
 * Create and initialize a NestJS application.
 *
 * @async
 *
 * @this {void}
 *
 * @param {TestingModule} ref
 *  Testing module
 * @return {Promise<NestFastifyApplication>}
 *  NestJS x Fastify application
 */
async function createApp(
  this: void,
  ref: TestingModule
): Promise<NestFastifyApplication> {
  /**
   * The application instance.
   *
   * @var {NestFastifyApplication} app
   */
  let app: NestFastifyApplication

  app = ref.createNestApplication(new FastifyAdapter(), {
    abortOnError: false,
    logger: false
  })

  return await app.init(), app
}

export default createApp
