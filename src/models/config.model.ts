/**
 * @file Data Models - Config
 * @module sneusers/models/Config
 */

import type { IConfig } from '#src/interfaces'
import { Exception } from '@flex-development/exceptions'
import { AppEnv, NodeEnv, isUndefined } from '@flex-development/tutils'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
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
   * Database hostname.
   *
   * @default 'mongo'
   *
   * @public
   * @instance
   * @member {string} DB_HOSTNAME
   */
  @IsString()
  @IsNotEmpty()
  public DB_HOSTNAME: string

  /**
   * Database name.
   *
   * @default APP_ENV
   *
   * @public
   * @instance
   * @member {string} DB_NAME
   */
  @IsString()
  @IsNotEmpty()
  public DB_NAME: string

  /**
   * Database password.
   *
   * @public
   * @instance
   * @member {string} DB_PASSWORD
   */
  @IsString()
  @IsNotEmpty()
  public DB_PASSWORD: string

  /**
   * Database port.
   *
   * @default 27017
   *
   * @public
   * @instance
   * @member {number} DB_PORT
   */
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  public DB_PORT: number

  /**
   * Database username.
   *
   * @default 'admin'
   *
   * @public
   * @instance
   * @member {string} DB_USERNAME
   */
  @IsString()
  @IsNotEmpty()
  public DB_USERNAME: string

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
    DB_HOSTNAME = 'mongo',
    DB_NAME = APP_ENV,
    DB_PASSWORD = '',
    DB_PORT = '27017',
    DB_USERNAME = 'admin',
    HTTPS_CERT = '',
    HTTPS_KEY = '',
    NODE_ENV = NodeEnv.DEV,
    URL = 'http://localhost'
  }: NodeJS.ProcessEnv = {}) {
    this.APP_ENV = APP_ENV as AppEnv
    this.DB_HOSTNAME = DB_HOSTNAME
    this.DB_NAME = DB_NAME
    this.DB_PASSWORD = DB_PASSWORD
    this.DB_PORT = +DB_PORT
    this.DB_USERNAME = DB_USERNAME
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
