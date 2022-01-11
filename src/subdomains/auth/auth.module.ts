import { Module } from '@nestjs/common'
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import UsersModule from '@sneusers/subdomains/users/users.module'
import { AuthController } from './controllers'
import { AuthService, JwtConfigService } from './providers'
import { JwtStrategy, LocalStrategy } from './strategies'

/**
 * @file Auth Subdomain - AuthModule
 * @module sneusers/subdomains/auth/AuthModule
 */

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(AuthModule.jwtModuleOptions)
  ],
  providers: [AuthService, LocalStrategy, JwtConfigService, JwtStrategy]
})
export default class AuthModule {
  /**
   * Returns the module {@link JwtModuleAsyncOptions}.
   *
   * @see https://github.com/nestjs/jwt#async-options
   *
   * @return {JwtModuleAsyncOptions} Module `JwtModuleAsyncOptions`
   */
  static get jwtModuleOptions(): JwtModuleAsyncOptions {
    return { useClass: JwtConfigService }
  }
}
