import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import CryptoModule from '@sneusers/modules/crypto/crypto.module'
import { CookieOptionsProvider } from '@sneusers/modules/middleware/providers'
import UsersModule from '@sneusers/subdomains/users/users.module'
import { AuthController, VerificationController } from './controllers'
import { Token } from './entities'
import {
  AuthService,
  JwtConfigService,
  Strategist,
  TokensService,
  VerificationService
} from './providers'
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from './strategies'

/**
 * @file Auth Subdomain - AuthModule
 * @module sneusers/subdomains/auth/AuthModule
 */

@Module({
  controllers: [AuthController, VerificationController],
  imports: [
    CryptoModule,
    JwtModule.registerAsync(JwtConfigService.moduleOptions),
    PassportModule,
    SequelizeModule.forFeature([Token]),
    UsersModule
  ],
  providers: [
    AuthService,
    CookieOptionsProvider(),
    JwtConfigService,
    JwtRefreshStrategy,
    JwtStrategy,
    LocalStrategy,
    Strategist,
    TokensService,
    VerificationService
  ]
})
export default class AuthModule {}
