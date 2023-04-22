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
