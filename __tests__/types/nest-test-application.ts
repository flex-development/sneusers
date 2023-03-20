/**
 * @file Test Environment Types - NestTestApplication
 * @module tests/types/NestTestApplication
 */

import type { NestExpressApplication } from '@nestjs/platform-express'
import type { TestingModule } from '@nestjs/testing'

/**
 * Object containing a NestJS application and testing module reference.
 */
type NestTestApplication = {
  /**
   * NestJS application.
   */
  app: NestExpressApplication

  /**
   * Testing [module reference][1].
   *
   * [1]: https://docs.nestjs.com/fundamentals/module-ref
   */
  ref: TestingModule
}

export type { NestTestApplication as default }
