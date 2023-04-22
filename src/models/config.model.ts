/**
 * @file Data Models - Config
 * @module sneusers/models/Config
 */

import type { IConfig } from '#src/interfaces'
import { Exception } from '@flex-development/exceptions'
import { AppEnv, NodeEnv, isUndefined } from '@flex-development/tutils'
import {
  IsEnum,
  IsString,
  IsUrl,
  validateSync,
  type ValidationError
} from 'class-validator'
import { shake } from 'radash'

/**
 * Data model representing environment variables used by the application.
 *
 * @class
 * @implements {IConfig}
 */
class Config implements IConfig {
  /**
   * Application environment.
   *
   * @see {@linkcode AppEnv}
   *
   * @default AppEnv.DEV
   *
   * @public
   * @instance
   * @member {AppEnv} APP_ENV
   */
  @IsEnum(AppEnv)
  public APP_ENV: AppEnv

  /**
   * HTTPS certfile content.
   *
   * @default ''
   *
   * @public
   * @instance
   * @member {string} HTTPS_CERT
   */
  @IsString()
  public HTTPS_CERT: string

  /**
   * HTTPS keyfile content.
   *
   * @default ''
   *
   * @public
   * @instance
   * @member {string} HTTPS_KEY
   */
  @IsString()
  public HTTPS_KEY: string

  /**
   * Node environment.
   *
   * @see {@linkcode NodeEnv}
   *
   * @default NodeEnv.DEV
   *
   * @public
   * @instance
   * @member {NodeEnv} NODE_ENV
   */
  @IsEnum(NodeEnv)
  public NODE_ENV: NodeEnv

  /**
   * Application URL (includes protocol).
   *
   * @default 'http://localhost'
   *
   * @public
   * @instance
   * @member {string} URL
   */
  @IsUrl({ require_protocol: true, require_tld: false })
  public URL: string

  /**
   * Creates a new configuration object instance.
   *
   * @param {NodeJS.ProcessEnv} [env={}] - Environment variables object
   */
  constructor({
    APP_ENV = AppEnv.DEV,
    HTTPS_CERT = '',
    HTTPS_KEY = '',
    NODE_ENV = NodeEnv.DEV,
    URL = 'http://localhost'
  }: NodeJS.ProcessEnv = {}) {
    this.APP_ENV = APP_ENV as AppEnv
    this.HTTPS_CERT = HTTPS_CERT
    this.HTTPS_KEY = HTTPS_KEY
    this.NODE_ENV = NODE_ENV as NodeEnv
    this.URL = URL

    // remove undefined properties
    Object.assign(this, shake(this, isUndefined))
  }

  /**
   * Config validator.
   *
   * @public
   *
   * @return {this} Validated configuration object
   * @throws {Exception<ValidationError>}
   */
  public validate(): Config {
    /**
     * Validation errors.
     *
     * @const {ValidationError[]} errors
     */
    const errors: ValidationError[] = validateSync(this, {
      enableDebugMessages: true,
      forbidUnknownValues: true,
      skipNullProperties: false,
      skipUndefinedProperties: false,
      stopAtFirstError: false,
      validationError: { target: false }
    })

    // throw if validation errors were encountered
    if (errors.length > 0) {
      throw new Exception<ValidationError>('Invalid configuration', {
        code: 'invalid-config',
        errors
      })
    }

    return this
  }
}

export default Config
