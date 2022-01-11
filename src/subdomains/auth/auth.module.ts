import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import UsersModule from '@sneusers/subdomains/users/users.module'
import { AuthController } from './controllers'
import { AuthService } from './providers'
import { LocalStrategy } from './strategies'

/**
 * @file Auth Subdomain - AuthModule
 * @module sneusers/subdomains/auth/AuthModule
 */

@Module({
  controllers: [AuthController],
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export default class AuthModule {}
