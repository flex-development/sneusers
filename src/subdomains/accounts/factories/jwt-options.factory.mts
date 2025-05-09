/**
 * @file Factories - JwtOptionsFactory
 * @module sneusers/accounts/factories/JwtOptions
 */

import type { Config } from '@flex-development/sneusers/types'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type {
  JwtOptionsFactory as IJwtOptionsFactory,
  JwtModuleOptions
} from '@nestjs/jwt'

/**
 * JWT options factory.
 *
 * @class
 * @implements {IJwtOptionsFactory}
 */
class JwtOptionsFactory implements IJwtOptionsFactory {
  /**
   * Create a JWT options factory.
   *
   * @param {ConfigService<Config, true>} config
   *  Application config service
   */
  constructor(
    @Inject(ConfigService) protected config: ConfigService<Config, true>
  ) {}

  /**
   * Create an JWT options object.
   *
   * @public
   * @instance
   *
   * @return {JwtModuleOptions}
   *  JWT module options
   */
  public createJwtOptions(): JwtModuleOptions {
    /**
     * The url the application will listen for incoming connections on.
     *
     * @const {URL} url
     */
    const url: URL = this.config.get<URL>('URL')

    return {
      secret: this.config.get('JWT_SECRET'),
      signOptions: { audience: url.host, issuer: url.host }
    }
  }
}

export default JwtOptionsFactory
