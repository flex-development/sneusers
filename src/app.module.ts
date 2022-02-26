import { HttpModule } from '@nestjs/axios'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { ThrottlerModule } from '@nestjs/throttler'
import { HealthController } from './controllers'
import {
  ErrorFilter,
  ExceptionClassFilter,
  HttpExceptionFilter
} from './filters'
import { ThrottlerProxyGuard } from './guards'
import CryptoModule from './modules/crypto/crypto.module'
import DatabaseModule from './modules/db/db.module'
import EmailModule from './modules/email/email.module'
import MiddlewareModule from './modules/middleware/middleware.module'
import RedisModule from './modules/redis/redis.module'
import {
  AppService,
  CacheConfigService,
  HttpConfigService,
  RedisConfigService,
  ThrottlerConfigService
} from './providers'
import AuthModule from './subdomains/auth/auth.module'
import UsersModule from './subdomains/users/users.module'

/**
 * @file AppModule
 * @module sneusers/AppModule
 */

@Module({
  controllers: [HealthController],
  imports: [
    AuthModule,
    CacheModule.registerAsync(CacheConfigService.moduleOptions),
    ConfigModule.forRoot(AppService.configModuleOptions),
    CryptoModule,
    DatabaseModule,
    EmailModule,
    HttpModule.registerAsync(HttpConfigService.moduleOptions),
    MiddlewareModule,
    RedisModule.registerAsync(RedisConfigService.moduleOptions),
    TerminusModule,
    ThrottlerModule.forRootAsync(ThrottlerConfigService.moduleOptions),
    UsersModule
  ],
  providers: [
    ErrorFilter.createProvider(),
    ExceptionClassFilter.createProvider(),
    HttpExceptionFilter.createProvider(),
    ThrottlerProxyGuard.createProvider()
  ]
})
export default class AppModule {}
