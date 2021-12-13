import type { ModuleMetadata } from '@nestjs/common'
import useGlobal from '@sneusers/use-global'
import createTestingModule from './creating-testing-module.util'
import type { NestTestApp } from './types'

/**
 * @file Global Test Utilities - createApp
 * @module tests/utils/createApp
 */

/**
 * Returns a NestJS test app and module reference.
 *
 * @see https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
 *
 * @async
 * @param {ModuleMetadata} metadata - Module metadata
 * @param {any} [provider] - Test provider
 * @param {any} [value] - Test provider value
 * @return {Promise<NestTestApp>} NestJS test app and module reference
 */
const createApp = async (
  metadata: ModuleMetadata,
  provider?: any,
  value?: any
): Promise<NestTestApp> => {
  const moduleRef = await createTestingModule(metadata, provider, value)
  const app = await useGlobal(moduleRef.createNestApplication())

  return { app, moduleRef }
}

export default createApp
