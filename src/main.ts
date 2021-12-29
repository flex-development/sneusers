import { NestFactory } from '@nestjs/core'
import { ENV } from './config/configuration'
import AppModule from './modules/app.module'
import AppService from './providers/app.service'
import useGlobal from './use-global'

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
 * @return {Promise<void>} Empty promise when complete
 */
async function bootstrap(): Promise<void> {
  // Create Nest application
  let app = await NestFactory.create(AppModule, AppService.options)

  // Apply global configurations
  app = await useGlobal(app)

  // Start application
  await app.listen(ENV.PORT, () => {
    return console.log(`[${ENV.NODE_ENV}] listening on ${ENV.HOST}`)
  })
}

// ! Run application
bootstrap()
