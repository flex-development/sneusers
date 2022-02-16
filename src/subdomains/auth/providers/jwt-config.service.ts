import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  JwtModuleAsyncOptions,
  JwtModuleOptions,
  JwtOptionsFactory
} from '@nestjs/jwt'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Auth Subdomain Providers - JwtConfigService
 * @module sneusers/subdomains/auth/providers/JwtConfigService
 */

@Injectable()
class JwtConfigService implements JwtOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Returns the application [`JwtModule`][1] configuration options.
   *
   * [1]: https://github.com/nestjs/jwt
   * [2]: https://github.com/nestjs/jwt#async-options
   *
   * @static
   * @return {JwtModuleAsyncOptions} [`JwtModule.registerAsync`][2] options
   */
  static get moduleOptions(): JwtModuleAsyncOptions {
    return { useClass: JwtConfigService }
  }

  /**
   * Returns the application JWT [secret and encryption key][1] options.
   *
   * [1]: https://github.com/nestjs/jwt#secret--encryption-key-options
   *
   * @return {JwtModuleOptions} Secret and encryption key options
   */
  createJwtOptions(): JwtModuleOptions {
    return {
      signOptions: {
        algorithm: 'HS256',
        audience: this.config.get<string>('HOST'),
        issuer: this.config.get<string>('HOSTNAME'),
        noTimestamp: false
      }
    }
  }
}

export default JwtConfigService
