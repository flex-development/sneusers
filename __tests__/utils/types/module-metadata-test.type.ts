import type { OrPromise } from '@flex-development/tutils'
import type { MiddlewareConsumer, ModuleMetadata } from '@nestjs/common'
import type { ModuleRef } from '@nestjs/core'
import type { ForRoutesConfig } from '@sneusers/types'

/**
 * @file Global Test Types - ModuleMetadataTest
 * @module tests/utils/types/ModuleMetadataTest
 */

/**
 * {@link ModuleMetadata} with additional options.
 */
type ModuleMetadataTest = ModuleMetadata & {
  middlewares?: Parameters<MiddlewareConsumer['apply']>
  onModuleDestroy?: (ref: ModuleRef) => OrPromise<void>
  onModuleInit?: (ref: ModuleRef) => OrPromise<void>
  routes?: ForRoutesConfig
}

export default ModuleMetadataTest
