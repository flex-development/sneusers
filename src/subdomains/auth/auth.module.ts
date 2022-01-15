import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import { CsurfMiddleware } from '@sneusers/middleware'
import type { EnvironmentVariables } from '@sneusers/models'
import UsersModule from '@sneusers/subdomains/users/users.module'
import { AuthController } from './controllers'
import { RefreshToken } from './entities'
import {
  AuthService,
  JwtConfigService,
  RefreshTokensService,
  TokensService
} from './providers'
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from './strategies'

/**
 * @file Auth Subdomain - AuthModule
 * @module sneusers/subdomains/auth/AuthModule
 */

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    JwtModule.registerAsync(AuthModule.JWT_MODULE_OPTIONS),
    PassportModule,
    SequelizeModule.forFeature([RefreshToken]),
    UsersModule
  ],
  providers: [
    AuthService,
    JwtConfigService,
    JwtRefreshStrategy,
    JwtStrategy,
    LocalStrategy,
    RefreshTokensService,
    TokensService
  ]
})
export default class AuthModule {
  /**
   * @static
   * @readonly
   * @property {JwtModuleAsyncOptions} JWT_MODULE_OPTIONS - `JwtModule` options
   */
  static readonly JWT_MODULE_OPTIONS: JwtModuleAsyncOptions = {
    useClass: JwtConfigService
  }

  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {
    CsurfMiddleware.configure({ ignoreRoutes: ['/auth/register'] })
  }

  /**
   * Configures middleware.
   *
   * @param {MiddlewareConsumer} consumer - Applies middleware to routes
   * @return {void} Nothing when complete
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CsurfMiddleware).forRoutes('*')
    return
  }
}
