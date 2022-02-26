import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { SequelizeModule } from '@nestjs/sequelize'
import UsersModule from '@sneusers/subdomains/users/users.module'
import {
  AuthController,
  OAuthController,
  VerificationController
} from './controllers'
import { Token } from './entities'
import {
  AuthService,
  JwtConfigService,
  PassportConfigService,
  Strategist,
  TokensService,
  VerificationService
} from './providers'
import {
  GitHubStrategy,
  GoogleStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy
} from './strategies'

/**
 * @file Auth Subdomain - AuthModule
 * @module sneusers/subdomains/auth/AuthModule
 */

@Module({
  controllers: [AuthController, OAuthController, VerificationController],
  imports: [
    JwtModule.registerAsync(JwtConfigService.moduleOptions),
    PassportModule.registerAsync(PassportConfigService.moduleOptions),
    SequelizeModule.forFeature([Token]),
    UsersModule
  ],
  providers: [
    AuthService,
    GitHubStrategy,
    GoogleStrategy,
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
