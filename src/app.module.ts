import { HttpModule } from '@nestjs/axios'
import { CacheModule, Module } from '@nestjs/common'
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
import CryptoModule from '@sneusers/modules/crypto/crypto.module'
import MiddlewareModule from '@sneusers/modules/middleware/middleware.module'
import RedisModule from '@sneusers/modules/redis/redis.module'
import {
  AppService,
  CacheConfigService,
  HttpConfigService,
  RedisConfigService,
  SequelizeConfigService,
  ThrottlerConfigService
} from '@sneusers/providers'
import AuthModule from '@sneusers/subdomains/auth/auth.module'
import UsersModule from '@sneusers/subdomains/users/users.module'

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
    HttpModule.registerAsync(HttpConfigService.moduleOptions),
    MiddlewareModule,
    RedisModule.registerAsync(RedisConfigService.moduleOptions),
    SequelizeModule.forRootAsync(SequelizeConfigService.moduleOptions),
    TerminusModule,
    ThrottlerModule.forRootAsync(ThrottlerConfigService.moduleOptions),
    UsersModule
  ],
  providers: [
    ErrorFilter.createProvider(),
    ExceptionClassFilter.createProvider(),
    HttpExceptionFilter.createProvider(),
    RedisConfigService,
    ThrottlerProxyGuard.createProvider()
  ]
})
export default class AppModule {}
