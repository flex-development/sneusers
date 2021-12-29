import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import * as MIDDLEWARE from '@sneusers/middleware'
import { AppService } from '@sneusers/providers'
import ConfigModule from './config.module'
import DatabaseModule from './database.module'

/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 * @see https://docs.nestjs.com/modules
 */

@Module({ imports: [ConfigModule, DatabaseModule], providers: [AppService] })
export default class AppModule implements NestModule {
  /**
   * Configures global middleware.
   *
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @return {void} Nothing when complete
   */
  configure(consumer: MiddlewareConsumer): void {
    for (const m of Object.values(MIDDLEWARE)) {
      consumer.apply(m).forRoutes({ method: RequestMethod.ALL, path: '*' })
    }
  }
}
