/**
 * @file Test Utilities - createTestingModule
 * @module tests/utils/createTestingModule
 */

import type { ModuleMetadata } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import createTestingModuleBuilder from './create-testing-module-builder'

/**
 * Creates a testing module.
 *
 * @see https://docs.nestjs.com/fundamentals/testing
 *
 * @async
 *
 * @param {ModuleMetadata} metadata - Module metadata
 * @return {Promise<TestingModule>} Testing module
 */
const createTestingModule = async (
  metadata: ModuleMetadata
): Promise<TestingModule> => createTestingModuleBuilder(metadata).compile()

export default createTestingModule
