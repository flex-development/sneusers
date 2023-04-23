/**
 * @file Test Utilities - createTestingModule
 * @module tests/utils/createTestingModule
 */

import type { TestModuleMetadata } from '#tests/interfaces'
import type { TestingModule } from '@nestjs/testing'
import createTestingModuleBuilder from './create-testing-module-builder'

/**
 * Creates a testing module.
 *
 * @see https://docs.nestjs.com/fundamentals/testing
 *
 * @async
 *
 * @param {TestModuleMetadata} metadata - Module metadata
 * @return {Promise<TestingModule>} Testing module
 */
const createTestingModule = async (
  metadata: TestModuleMetadata
): Promise<TestingModule> => createTestingModuleBuilder(metadata).compile()

export default createTestingModule
