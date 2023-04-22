/**
 * @file HealthModule
 * @module sneusers/subdomains/health/HealthModule
 */

import type { IConfig } from '#src/interfaces'
import { HttpModule, type HttpModuleOptions } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './controllers'

/**
 * Healthcheck module.
 *
 * @class
 */
@Module({
  controllers: [HealthController],
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService<IConfig, true>): HttpModuleOptions => ({
        baseURL: conf.get<string>('URL'),
        transitional: { clarifyTimeoutError: true, silentJSONParsing: false }
      })
    }),
    TerminusModule
  ]
})
class HealthModule {}

export default HealthModule
