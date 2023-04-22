/**
 * @file DocsModule
 * @module sneusers/subdomains/docs/DocsModule
 */

import type { IConfig } from '#src/interfaces'
import { RxJSProvider } from '#src/providers'
import { HttpModule, type HttpModuleOptions } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule } from '@nestjs/swagger'
import { DocsController } from './controllers'

/**
 * API documentation module.
 *
 * @class
 * @extends {SwaggerModule}
 */
@Module({
  controllers: [DocsController],
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService<IConfig, true>): HttpModuleOptions => ({
        baseURL: conf.get<string>('URL'),
        transitional: { clarifyTimeoutError: true, silentJSONParsing: false }
      })
    })
  ],
  providers: [RxJSProvider]
})
class DocsModule extends SwaggerModule {}

export default DocsModule
