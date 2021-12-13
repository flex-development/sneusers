import type { INestApplication } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'

/**
 * @file Global Test Types - NestTestApp
 * @module tests/utils/types/NestTestApp
 */

/**
 * Object containing a NestJS application and testing module reference.
 */
type NestTestApp = {
  app: INestApplication
  module_ref: TestingModule
}

export default NestTestApp
