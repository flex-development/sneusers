/**
 * @file Test Utilities - createTestingModuleBuilder
 * @module tests/utils/createTestingModuleBuilder
 */

import MiddlewareModule from '#src/middleware/middleware.module'
import { Config } from '#src/models'
import type { TestModuleMetadata } from '#tests/interfaces'
import {
  Module,
  type MiddlewareConsumer,
  type NestModule
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import type { TestingModuleBuilder } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import ci from 'is-ci'

/**
 * Creates a testing module builder.
 *
 * @see https://docs.nestjs.com/fundamentals/testing
 *
 * @param {TestModuleMetadata} metadata - Module metadata
 * @return {TestingModuleBuilder} Testing module builder
 */
const createTestingModuleBuilder = ({
  middlewares = [],
  ...metadata
}: TestModuleMetadata): TestingModuleBuilder => {
  metadata.imports = metadata.imports ?? []

  /**
   * Test application module.
   *
   * @class
   * @implements {NestModule}
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
  class TestAppModule implements NestModule {
    /**
     * Configures global middleware.
     *
     * @public
     *
     * @param {MiddlewareConsumer} consumer - Middleware helper
     * @return {void} Nothing when complete
     */
    public configure(consumer: MiddlewareConsumer): void {
      return void MiddlewareModule.configure(consumer, middlewares)
    }
  }

  return Test.createTestingModule({ imports: [TestAppModule] })
}

export default createTestingModuleBuilder
