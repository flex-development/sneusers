import { NestApplicationOptions } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { AppEnv } from '@sneusers/enums'
import AppModule from './app.module'
import useGlobal from './hooks/use-global.hook'
import type { EnvironmentVariables } from './models'
import AppService from './providers/app.service'
import { runInCluster } from './utils'

/**
 * @file Main
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
  const app = await useGlobal(await NestFactory.create(AppModule, options))
  const conf: ConfigService<EnvironmentVariables, true> = app.get(ConfigService)

  const APP_ENV = conf.get<AppEnv>('APP_ENV')
  const HOST = conf.get<string>('HOST')
  const PORT = conf.get<number>('PORT')

  await app.listen(PORT, () => {
    return console.log(`[${APP_ENV}] listening at ${HOST}`)
  })
}

// ! Run application
runInCluster(bootstrap, AppService.options)
