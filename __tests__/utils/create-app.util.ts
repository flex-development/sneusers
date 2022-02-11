import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import useGlobal from '@sneusers/hooks/use-global.hook'
import CryptoModule from '@sneusers/modules/crypto/crypto.module'
import EmailModule from '@sneusers/modules/email/email.module'
import MiddlewareModule from '@sneusers/modules/middleware/middleware.module'
import RedisModule from '@sneusers/modules/redis/redis.module'
import AppService from '@sneusers/providers/app.service'
import RedisConfigService from '@sneusers/providers/redis-config.service'
import CsrfTokenController from '@tests/fixtures/csrf-token-controller.fixture'
import SequelizeConfig from '@tests/fixtures/sequelize-config-service.fixture'
import createTestingModule from './creating-testing-module.util'
import { ModuleMetadataTest, NestAppTest } from './types'

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
 * @return {Promise<NestAppTest>} NestJS test app and module reference
 */
const createApp = async (
  metadata: ModuleMetadataTest = {},
  provider?: any,
  value?: any
): Promise<NestAppTest> => {
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
      EmailModule,
      RedisModule.registerAsync(RedisConfigService.moduleOptions),
      SequelizeModule.forRoot(SequelizeConfig.createSequelizeOptions()),
      ...imports
    ],
    providers: [...providers]
  })
  class TModule implements NestModule {
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
  }

  const ref = await createTestingModule({ imports: [TModule] }, provider, value)
  const app = await useGlobal(ref.createNestApplication())

  return { app, ref }
}

export default createApp
