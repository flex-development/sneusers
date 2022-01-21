import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import { CsurfMiddleware } from '@sneusers/middleware'
import type { EnvironmentVariables } from '@sneusers/models'
import UsersModule from '@sneusers/subdomains/users/users.module'
import { AuthController } from './controllers'
import { Token } from './entities'
import {
  AuthService,
  AuthTokensService,
  JwtConfigService,
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
    JwtModule.registerAsync(JwtConfigService.moduleOptions),
    PassportModule,
    SequelizeModule.forFeature([Token]),
    UsersModule
  ],
  providers: [
    AuthService,
    AuthTokensService,
    JwtConfigService,
    JwtRefreshStrategy,
    JwtStrategy,
    LocalStrategy,
    TokensService
  ]
})
export default class AuthModule {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {
    CsurfMiddleware.configure({
      ignoreRoutes: ['/auth/register', '/auth/verify', '/auth/verify/resend']
    })
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
