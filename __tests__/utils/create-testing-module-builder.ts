/**
 * @file Test Utilities - createTestingModuleBuilder
 * @module tests/utils/createTestingModuleBuilder
 */

import { Config } from '#src/models'
import { Module, type ModuleMetadata } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import type { TestingModuleBuilder } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import ci from 'is-ci'

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
  metadata.imports = metadata.imports ?? []

  /**
   * Test application module.
   *
   * @class
   */
  @Module({
    ...metadata,
    imports: [
      ...metadata.imports,
      ConfigModule.forRoot({
        cache: false,
        envFilePath: ['.env.test', '.env'],
        expandVariables: { ignoreProcessEnv: !ci },
        ignoreEnvFile: ci,
        ignoreEnvVars: !ci,
        isGlobal: true,
        validate: (config: Record<string, any>): Config => {
          return new Config(config).validate()
        }
      })
    ]
  })
  class TestAppModule {}

  return Test.createTestingModule({ imports: [TestAppModule] })
}

export default createTestingModuleBuilder
