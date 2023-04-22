/**
 * @file Test Utilities - createTestingModuleBuilder
 * @module tests/utils/createTestingModuleBuilder
 */

import type { ModuleMetadata } from '@nestjs/common'
import type { TestingModuleBuilder } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

/**
 * Creates a testing module builder.
 *
 * @see https://docs.nestjs.com/fundamentals/testing
 *
 * @param {ModuleMetadata} metadata - Module metadata
 * @return {TestingModuleBuilder} Testing module builder
 */
const createTestingModuleBuilder = (
  metadata: ModuleMetadata
): TestingModuleBuilder => {
  return Test.createTestingModule(metadata)
}

export default createTestingModuleBuilder
