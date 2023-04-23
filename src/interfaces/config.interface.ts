/**
 * @file Interfaces - IConfig
 * @module sneusers/interfaces/IConfig
 */

import type { AppEnv, NodeEnv } from '@flex-development/tutils'

/**
 * Object representing environment variables used by the application.
 */
interface IConfig {
  /**
   * Application environment.
   *
   * @see {@linkcode AppEnv}
   *
   * @default AppEnv.DEV
   */
  APP_ENV: AppEnv

  /**
   * Database hostname.
   *
   * @default 'mongo'
   */
  DB_HOSTNAME: string

  /**
   * Database name.
   *
   * @default APP_ENV
   */
  DB_NAME: string

  /**
   * Database password.
   */
  DB_PASSWORD: string

  /**
   * Database port.
   *
   * @default 27017
   */
  DB_PORT: number

  /**
   * Database username.
   *
   * @default 'admin'
   */
  DB_USERNAME: string

  /**
   * HTTPS certfile content.
   *
   * @default ''
   */
  HTTPS_CERT: string

  /**
   * HTTPS certfile content.
   *
   * @default ''
   */
  HTTPS_KEY: string

  /**
   * Node environment.
   *
   * @see {@linkcode NodeEnv}
   *
   * @default NodeEnv.DEV
   */
  NODE_ENV: NodeEnv

  /**
   * Application URL (includes protocol).
   *
   * @default 'http://localhost'
   */
  URL: string
}

export type { IConfig as default }
