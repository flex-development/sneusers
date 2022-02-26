import type { ModuleMetadata } from '@nestjs/common'
import type {
  OverrideBy,
  TestingModule,
  TestingModuleBuilder
} from '@nestjs/testing'
import { Test } from '@nestjs/testing'

/**
 * @file Global Test Utilities - createTestingModule
 * @module tests/utils/createTestingModule
 */

/**
 * Returns a NestJS testing module.
 *
 * @see https://docs.nestjs.com/fundamentals/testing#testing-utilities
 *
 * @async
 * @param {ModuleMetadata} metadata - Module metadata
 * @param {any} [provider] - Test provider
 * @param {any} [value] - Test provider value
 * @return {Promise<TestingModule>} NestJS testing module
 */
const createTestingModule = async (
  metadata: ModuleMetadata,
  provider?: any,
  value?: any
): Promise<TestingModule> => {
  type Ref = TestingModuleBuilder | OverrideBy
  let ref: Ref = Test.createTestingModule(metadata)

  if (provider) ref = ref.overrideProvider(provider)
  if (provider && value) ref = (ref as OverrideBy).useValue(value)

  return await (ref as TestingModuleBuilder).compile()
}

export default createTestingModule
