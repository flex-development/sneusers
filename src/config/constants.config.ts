import type { NestApplicationOptions as NestAppOptions } from '@nestjs/common'

/**
 * @file Configuration - Constant Values
 * @module sneusers/config/constants
 */

/**
 * @property {string} DEBUG_NAMESPACE - Name of `debug` namespace
 * @see https://github.com/visionmedia/debug
 */
export const DEBUG_NAMESPACE: string = 'sneusers'

/** @property {NestAppOptions} NEST_APP_OPTIONS - NestJS application options */
export const NEST_APP_OPTIONS: NestAppOptions = {
  cors: true,
  logger: console
}
