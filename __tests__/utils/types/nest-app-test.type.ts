import type { NestExpressApplication } from '@nestjs/platform-express'
import type { TestingModule } from '@nestjs/testing'

/**
 * @file Global Test Types - NestAppTest
 * @module tests/utils/types/NestAppTest
 */

/**
 * Object containing a NestJS application and testing module reference.
 */
type NestAppTest = {
  app: NestExpressApplication
  ref: TestingModule
}

export default NestAppTest
