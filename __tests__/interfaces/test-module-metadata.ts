/**
 * @file Test Environment Interfaces - TestModuleMetadata
 * @module tests/interfaces/TestModuleMetadata
 */

import type { ModuleMetadata, NestMiddleware, Type } from '@nestjs/common'
import type { RouteInfo } from '@nestjs/common/interfaces'

/**
 * Object containing test module metadata.
 *
 * @see {@linkcode ModuleMetadata}
 *
 * @extends {ModuleMetadata}
 */
interface TestModuleMetadata extends ModuleMetadata {
  /**
   * Global middleware to apply.
   *
   * @see {@linkcode NestMiddleware}
   * @see {@linkcode RouteInfo}
   *
   * @default []
   */
  middlewares?: [Type<NestMiddleware>, RouteInfo][]
}

export type { TestModuleMetadata as default }
