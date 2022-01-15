import { HttpModule } from '@nestjs/axios'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from '@sneusers/controllers'
import { ErrorFilter } from '@sneusers/filters'
import {
  CookieParserMiddleware,
  HttpLoggerMiddleware
} from '@sneusers/middleware'
import { AppService } from '@sneusers/providers'
import { AuthModule, UsersModule } from '@sneusers/subdomains'
import CryptoModule from './crypto.module'

/**
 * @file Modules - AppModule
 * @module sneusers/modules/AppModule
 */

@Module({
  controllers: [HealthController],
  imports: [
    AuthModule,
    ConfigModule.forRoot(AppService.configModuleOptions),
    CryptoModule,
    HttpModule,
    SequelizeModule.forRootAsync(AppService.sequelizeModuleOptions),
    TerminusModule,
    UsersModule
  ],
  providers: [AppService, { provide: APP_FILTER, useClass: ErrorFilter }]
})
export default class AppModule implements NestModule {
  /**
   * Configures global middleware.
   *
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @return {void} Nothing when complete
   */
  configure(consumer: MiddlewareConsumer): void {
    const middleware = [HttpLoggerMiddleware, CookieParserMiddleware]

    for (const m of middleware) {
      consumer.apply(m).forRoutes({ method: RequestMethod.ALL, path: '*' })
    }
  }
}
