import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  AuthModuleAsyncOptions,
  AuthOptionsFactory,
  IAuthModuleOptions
} from '@nestjs/passport'
import type { EnvironmentVariables } from '@sneusers/models'
import { AuthenticateOptions } from 'passport'

/**
 * @file Auth Subdomain Providers - PassportConfigService
 * @module sneusers/subdomains/auth/providers/PassportConfigService
 */

@Injectable()
class PassportConfigService implements AuthOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Get [`PassportModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/security/authentication
   *
   * @see https://github.com/nestjs/passport
   *
   * @static
   * @return {AuthModuleAsyncOptions} Module options
   */
  static get moduleOptions(): AuthModuleAsyncOptions {
    return { useClass: PassportConfigService }
  }

  /**
   * Get [`passport.authenticate`][1] options.
   *
   * [1]: https://github.com/jaredhanson/passport/blob/master/lib/middleware/authenticate.js
   *
   * @return {IAuthModuleOptions & AuthenticateOptions} Authentication options
   */
  createAuthOptions(): IAuthModuleOptions & AuthenticateOptions {
    return {
      authInfo: true,
      failWithError: true,
      property: 'user'
    }
  }
}

export default PassportConfigService
