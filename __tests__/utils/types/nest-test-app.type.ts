import type { NestExpressApplication } from '@nestjs/platform-express'
import type { TestingModule } from '@nestjs/testing'

/**
 * @file Global Test Types - NestTestApp
 * @module tests/utils/types/NestTestApp
 */

/**
 * Object containing a NestJS application and testing module reference.
 */
type NestTestApp = {
  app: NestExpressApplication
  ref: TestingModule
}

export default NestTestApp
