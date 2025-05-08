/**
 * @file main
 * @module sneusers/main
 */

import createApp from '#app'
import logger from '@flex-development/log'
import type { Config } from '@flex-development/sneusers/types'
import { ConfigService } from '@nestjs/config'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'

/**
 * The NestJS application.
 *
 * @const {NestFastifyApplication} app
 */
const app: NestFastifyApplication = await createApp()

/**
 * App configuration service.
 *
 * @const {ConfigService<Config, true>} config
 */
const config: ConfigService<Config, true> = app.get(ConfigService)

// start application.
await app.listen(
  {
    host: config.get('HOST'),
    port: +config.get('PORT')
  },
  /**
   * @this {void}
   *
   * @param {Error | null} err
   *  The error to handle
   * @param {string} address
   *  The address the application is listening for incoming connections on
   * @return {undefined}
   */
  function callback(this: void, err: Error | null, address: string): undefined {
    return void logger.start({
      args: [config.get('NODE_ENV'), config.get<URL>('URL').href, address],
      message: '[%s] Listening at %s (%s)'
    })
  }
)
