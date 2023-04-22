/**
 * @file AppModule
 * @module sneusers/AppModule
 */

import { AppEnv, NodeEnv } from '@flex-development/tutils'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Config } from './models'
import { DocsModule } from './subdomains'

/**
 * Main application module.
 *
 * @class
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache:
        process.env.APP_ENV === AppEnv.PROD &&
        process.env.NODE_ENV === NodeEnv.PROD,
      ignoreEnvFile: true,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [() => new Config(process.env).validate()]
    }),
    DocsModule
  ]
})
class AppModule {}

export default AppModule
