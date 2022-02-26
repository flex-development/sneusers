import CsrfTokenController from '@fixtures/csrf-token-controller.fixture'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import useGlobal from '@sneusers/hooks/use-global.hook'
import CryptoModule from '@sneusers/modules/crypto/crypto.module'
import DatabaseModule from '@sneusers/modules/db/db.module'
import EmailModule from '@sneusers/modules/email/email.module'
import MiddlewareModule from '@sneusers/modules/middleware/middleware.module'
import RedisModule from '@sneusers/modules/redis/redis.module'
import AppService from '@sneusers/providers/app.service'
import RedisConfigService from '@sneusers/providers/redis-config.service'
import createTestingModule from './create-testing-module.util'
import { ModuleMetadataTest } from './types'

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
 * @param {ModuleMetadataTest} [metadata={}] - Module metadata
 * @param {any} [provider] - Test provider
 * @param {any} [value] - Test provider value
 * @return {Promise<NestExpressApplication>} NestJS test application
 */
const createApp = async (
  metadata: ModuleMetadataTest = {},
  provider?: any,
  value?: any
): Promise<NestExpressApplication> => {
  const controllers = metadata?.controllers ?? []
  const exports = metadata?.exports ?? []
  const imports = metadata?.imports ?? []
  const providers = metadata?.providers ?? []

  @Module({
    controllers: [CsrfTokenController, ...controllers],
    exports: [...exports],
    imports: [
      ConfigModule.forRoot(AppService.configModuleOptions),
      CryptoModule,
      DatabaseModule,
      EmailModule,
      RedisModule.registerAsync(RedisConfigService.moduleOptions),
      ...imports
    ],
    providers: [...providers]
  })
  class TModule implements NestModule, OnModuleDestroy, OnModuleInit {
    constructor(protected readonly ref: ModuleRef) {}

    /**
     * Configures middleware.
     *
     * @async
     * @param {MiddlewareConsumer} consumer - Applies middleware to routes
     * @return {void} Empty promise when complete
     */
    async configure(consumer: MiddlewareConsumer): Promise<void> {
      await MiddlewareModule.configure(
        consumer,
        metadata?.middlewares,
        metadata?.routes
      )
    }

    /**
     * Calls {@link metadata.onModuleDestroy}.
     *
     * @async
     * @return {Promise<void>} Empty promise when complete
     */
    async onModuleDestroy(): Promise<void> {
      if (metadata.onModuleDestroy) await metadata.onModuleDestroy(this.ref)
    }

    /**
     * Calls {@link metadata.onModuleInit}.
     *
     * @async
     * @return {Promise<void>} Empty promise when complete
     */
    async onModuleInit(): Promise<void> {
      if (metadata.onModuleInit) await metadata.onModuleInit(this.ref)
    }
  }

  const mod = await createTestingModule({ imports: [TModule] }, provider, value)

  return (await useGlobal(mod.createNestApplication())).init()
}

export default createApp
