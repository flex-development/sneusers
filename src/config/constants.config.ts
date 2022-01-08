import type { NestApplicationOptions as NestAppOptions } from '@nestjs/common'
import pkg from 'read-pkg'

/**
 * @file Configuration - Constant Values
 * @module sneusers/config/constants
 */

/**
 * @property {string} CURRENT_TIMESTAMP - Stringified `strftime` call
 * @see https://www.w3resource.com/sqlite/sqlite-strftime.php
 */
export const CURRENT_TIMESTAMP: string = "strftime('%s','now')"

/**
 * @property {string} DEBUG_NAMESPACE - Name of `debug` namespace
 * @see https://github.com/visionmedia/debug
 */
export const DEBUG_NAMESPACE: string = 'sneusers'

/** @property {Package} PACKAGE - `package.json` data */
export const PACKAGE: Package = pkg.sync({ normalize: false }) as Package

/** @property {NestAppOptions} NEST_APP_OPTIONS - NestJS application options */
export const NEST_APP_OPTIONS: NestAppOptions = {
  cors: true,
  logger: console
}
