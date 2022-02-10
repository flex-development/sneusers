import type { MiddlewareConsumer, ModuleMetadata } from '@nestjs/common'
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
  routes?: ForRoutesConfig
}

export default ModuleMetadataTest
