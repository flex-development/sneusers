import type { IGreaseOptions } from '@flex-development/grease/interfaces'
import log from '@flex-development/log'
import LogLevel from '@flex-development/log/enums/log-level.enum'
import type { Level } from '@flex-development/log/types'

/**
 * @file Helpers - Logger
 * @module tools/helpers/logger
 */

/**
 * Simple logger.
 *
 * @param {IGreaseOptions} options - Application options
 * @param {string} message - Message to log
 * @param {any[]} [args=[]] - Additional messages
 * @param {Level} [level=LogLevel.SUCCESS] - Log level
 * @param {boolean} [bold=false] - Bold message
 * @return {ReturnType<typeof log>} Formatted log message
 */
const logger = (
  options: IGreaseOptions,
  message: string,
  args: any[] = [],
  level: Level = LogLevel.SUCCESS,
  bold: boolean = false
): ReturnType<typeof log> => {
  return log(message, {
    args,
    bold: { args: true, data: bold },
    level: options.dryRun ? LogLevel.WARN : level,
    silent: options.silent
  })
}

export default logger
