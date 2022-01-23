import { NestApplicationOptions } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NodeEnv } from '@sneusers/enums'
import useGlobal from './hooks/use-global.hook'
import type { EnvironmentVariables } from './models'
import AppModule from './modules/app/app.module'
import AppService from './providers/app.service'
import { runInCluster } from './utils'

/**
 * @file Server Entry Point
 * @module sneusers/main
 */

/**
 * Applies global configurations and starts the application.
 *
 * @see {@link NestFactory.create}
 * @see {@link useGlobal}
 *
 * @async
 * @param {NestApplicationOptions} options - Application options
 * @return {Promise<void>} Empty promise when complete
 */
async function bootstrap(options?: NestApplicationOptions): Promise<void> {
  // Create Nest application and apply global configurations
  const app = await useGlobal(await NestFactory.create(AppModule, options))

  // Get configuration service
  const conf: ConfigService<EnvironmentVariables, true> = app.get(ConfigService)

  // Start application
  await app.listen(conf.get<number>('PORT'), () => {
    const HOST = conf.get<string>('HOST')
    const NODE_ENV = conf.get<NodeEnv>('NODE_ENV')

    return console.log(`[${NODE_ENV}] listening on ${HOST}`)
  })
}

// ! Run application
/** @see {@link runInCluster} */
runInCluster(bootstrap, AppService.options)
