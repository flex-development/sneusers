/**
 * @file AppModule
 * @module sneusers/AppModule
 */

import { AppEnv, NodeEnv } from '@flex-development/tutils'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import DatabaseModule from './database/database.module'
import MiddlewareModule from './middleware/middleware.module'
import { Config } from './models'
import { RxJSProvider, ValidationProvider } from './providers'
import { DocsModule, HealthModule } from './subdomains'

/**
 * Main application module.
 *
 * @class
 */
@Global()
@Module({
  exports: [RxJSProvider],
  imports: [
    ConfigModule.forRoot({
      cache:
        process.env.APP_ENV === AppEnv.PROD &&
        process.env.NODE_ENV === NodeEnv.PROD,
      ignoreEnvFile: true,
      ignoreEnvVars: false,
      isGlobal: true,
      validate: (config: Record<string, any>): Config => {
        return new Config(config).validate()
      }
    }),
    DatabaseModule,
    DocsModule,
    HealthModule,
    MiddlewareModule
  ],
  providers: [ValidationProvider, RxJSProvider]
})
class AppModule {}

export default AppModule
