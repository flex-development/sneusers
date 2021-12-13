import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { EnvironmentVariables } from './models'
import AppModule from './modules/app.module'
import useGlobal from './use-global'

/**
 * @file Server Entry Point
 * @module sneusers/main
 */

/**
 * Initializes globals and starts the application.
 *
 * @see {@link useGlobal}
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
async function bootstrap(): Promise<void> {
  // Create Nest application
  const app = await useGlobal(await NestFactory.create(AppModule))

  // Get app configuration service
  const conf = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService)

  // Get environment variables
  const HOST = conf.get<EnvironmentVariables['HOST']>('HOST')
  const NODE_ENV = conf.get<EnvironmentVariables['NODE_ENV']>('NODE_ENV')
  const PORT = conf.get<EnvironmentVariables['PORT']>('PORT')

  // Start application
  await app.listen(PORT, () => {
    return console.log(`[${NODE_ENV}] listening on ${HOST}`)
  })
}

// ! Run application
bootstrap()
