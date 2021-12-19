import { HttpStatus, NestApplicationOptions } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ENV } from './config/configuration'
import AppModule from './modules/app.module'
import useGlobal from './use-global'

/**
 * @file Server Entry Point
 * @module sneusers/main
 */

/**
 * Applies global configurations and starts the application.
 *
 * @see {@link useGlobal}
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
async function bootstrap(): Promise<void> {
  // Get Nest application options
  const options: NestApplicationOptions = {
    cors: {
      allowedHeaders: '*',
      methods: ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST'],
      optionsSuccessStatus: HttpStatus.ACCEPTED,
      origin: '*',
      preflightContinue: true
    },
    httpsOptions: {
      cert: ENV.SSL_CERT,
      key: ENV.SSL_KEY,
      passphrase: ENV.SSL_PASSPHRASE
    }
  }

  // Create Nest application and apply global configurations
  const app = await useGlobal(await NestFactory.create(AppModule, options))

  // Start application
  await app.listen(ENV.PORT, () => {
    return console.log(`[${ENV.NODE_ENV}] listening on ${ENV.HOST}`)
  })
}

// ! Run application
bootstrap()
