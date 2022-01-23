import { HttpModule } from '@nestjs/axios'
import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { TerminusModule } from '@nestjs/terminus'
import { ThrottlerModule } from '@nestjs/throttler'
import { HealthController } from '@sneusers/controllers'
import {
  ErrorFilter,
  ExceptionClassFilter,
  HttpExceptionFilter
} from '@sneusers/filters'
import { ThrottlerProxyGuard } from '@sneusers/guards'
import {
  CookieParserMiddleware,
  HelmetMiddleware,
  HttpLoggerMiddleware
} from '@sneusers/middleware'
import CryptoModule from '@sneusers/modules/crypto/crypto.module'
import EmailModule from '@sneusers/modules/email/email.module'
import {
  AppService,
  CacheConfigService,
  HttpConfigService,
  SequelizeConfigService,
  ThrottlerConfigService
} from '@sneusers/providers'
import AuthModule from '@sneusers/subdomains/auth/auth.module'
import UsersModule from '@sneusers/subdomains/users/users.module'

/**
 * @file AppModule
 * @module sneusers/modules/app/AppModule
 */

@Module({
  controllers: [HealthController],
  imports: [
    AuthModule,
    CacheModule.registerAsync(CacheConfigService.moduleOptions),
    ConfigModule.forRoot(AppService.configModuleOptions),
    CryptoModule,
    EmailModule,
    HttpModule.registerAsync(HttpConfigService.moduleOptions),
    SequelizeModule.forRootAsync(SequelizeConfigService.moduleOptions),
    TerminusModule,
    ThrottlerModule.forRootAsync(ThrottlerConfigService.moduleOptions),
    UsersModule
  ],
  providers: [
    ErrorFilter.PROVIDER,
    ExceptionClassFilter.PROVIDER,
    HttpExceptionFilter.PROVIDER,
    ThrottlerProxyGuard.PROVIDER
  ]
})
export default class AppModule implements NestModule {
  /**
   * Configures global middleware.
   *
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @return {void} Nothing when complete
   */
  configure(consumer: MiddlewareConsumer): void {
    const middleware = [
      HttpLoggerMiddleware,
      HelmetMiddleware,
      CookieParserMiddleware
    ]

    for (const m of middleware) {
      consumer.apply(m).forRoutes({ method: RequestMethod.ALL, path: '*' })
    }
  }
}
