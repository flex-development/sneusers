import { Module } from '@nestjs/common'
import UsersModule from '@sneusers/subdomains/users/users.module'
import { AuthController } from './controllers'
import { AuthService } from './providers'

/**
 * @file Auth Subdomain - AuthModule
 * @module sneusers/subdomains/auth/AuthModule
 */

@Module({
  controllers: [AuthController],
  imports: [UsersModule],
  providers: [AuthService]
})
export default class AuthModule {}
