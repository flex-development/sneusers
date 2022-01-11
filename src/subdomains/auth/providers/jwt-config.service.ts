import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Auth Subdomain Providers - JwtConfigService
 * @module sneusers/subdomains/auth/providers/JwtConfigService
 */

@Injectable()
export default class JwtConfigService implements JwtOptionsFactory {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Returns the application {@link JwtModuleOptions}.
   *
   * @see https://github.com/nestjs/jwt#async-options
   *
   * @return {JwtModuleOptions} Application `JwtModuleOptions`
   */
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '60s' }
    }
  }
}
