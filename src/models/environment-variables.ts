/**
 * @file Models - EnvironmentVariables
 * @module sneusers/models/EnvironmentVariables
 */

import {
  AppEnv,
  NodeEnv,
  isAppEnv,
  isNodeEnv,
  isUndefined
} from '@flex-development/tutils'
import { IsEnum, IsNumber, IsUrl } from 'class-validator'
import { shake } from 'radash'

/**
 * Environment variables used by this application.
 *
 * @class
 */
class EnvironmentVariables {
  /**
   * Application environment.
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
   * Node environment.
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
   * Port to run application on.
   *
   * @default 8080
   *
   * @public
   * @instance
   * @member {number} PORT
   */
  @IsNumber()
  public PORT: number

  /**
   * Application URL (includes scheme and {@linkcode PORT} if applicable).
   *
   * @default `http://localhost:${PORT}`
   *
   * @public
   * @instance
   * @member {string} URL
   */
  @IsUrl({
    allow_fragments: false,
    allow_query_components: false,
    require_protocol: true,
    require_tld: false
  })
  public URL: string

  /**
   * Creates an {@linkcode EnvironmentVariables} instance.
   *
   * @param {Record<string, string | undefined>} [env={}] - Object containing
   * environment variables
   */
  constructor({
    APP_ENV = AppEnv.DEV,
    NODE_ENV = NodeEnv.DEV,
    PORT = '8080',
    URL = `http://localhost:${+PORT}`
  }: Record<string, string | undefined> = {}) {
    this.APP_ENV = isAppEnv(APP_ENV) ? APP_ENV : AppEnv.DEV
    this.NODE_ENV = isNodeEnv(NODE_ENV) ? NODE_ENV : NodeEnv.DEV
    this.PORT = +PORT
    this.URL = URL

    // remove undefined properties
    Object.assign(this, shake(this, isUndefined))
  }
}

export default EnvironmentVariables
