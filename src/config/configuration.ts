import type { NumberString } from '@flex-development/tutils'
import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import isNIL from '@flex-development/tutils/guards/is-nil.guard'
import { EnvironmentVariables } from '@sneusers/models'
import { classToPlain } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'

/**
 * @file Configuration - Environment Variables
 * @module sneusers/config/configuration
 * @see https://docs.nestjs.com/techniques/configuration
 */

/** @property {string[]} ENV_FILE_PATH - Custom environment files */
const ENV_FILE_PATH = [`${process.cwd()}/.env.local`, `${process.cwd()}/.env`]

/**
 * Validates environment variables.
 *
 * @param {Record<string, any>} config - Object containing environment variables
 * @return {EnvironmentVariables} **Validated** environment variables
 * @throws {ValidationError[]}
 */
const validate = ({
  DB_AUTO_LOAD_MODELS = 'true',
  DB_HOST = 'localhost',
  DB_LOG_QUERY_PARAMS = 'true',
  DB_LOGGING = 'true',
  DB_NAME,
  DB_PASSWORD,
  DB_PORT = '3306',
  DB_TIMEZONE = '-05:00',
  DB_USERNAME,
  HOST,
  HOSTNAME = 'localhost',
  NODE_ENV = NodeEnv.DEV,
  PORT = '8080',
  SSL_CERT,
  SSL_KEY,
  SSL_PASSPHRASE
}: Record<string, any>): EnvironmentVariables => {
  const env = new EnvironmentVariables()

  // Set Node environment
  env.NODE_ENV = NODE_ENV

  // Check if running in local production mode or deployed production mode
  env.PROD_LOCAL = env.NODE_ENV === NodeEnv.PROD && HOSTNAME === 'localhost'
  env.PROD = env.NODE_ENV === NodeEnv.PROD && !env.PROD_LOCAL

  // Set hostname and port to run application on
  env.HOSTNAME = HOSTNAME
  env.PORT = Number.parseInt(PORT.toString())

  // Assign remaining environment variables
  env.DB_AUTO_LOAD_MODELS = JSON.parse(DB_AUTO_LOAD_MODELS)
  env.DB_HOST = DB_HOST
  env.DB_LOG_QUERY_PARAMS = JSON.parse(DB_LOG_QUERY_PARAMS)
  env.DB_LOGGING = JSON.parse(DB_LOGGING)
  env.DB_NAME = DB_NAME
  env.DB_PASSWORD = DB_PASSWORD
  env.DB_PORT = Number.parseInt(DB_PORT.toString())
  env.DB_TIMEZONE = DB_TIMEZONE
  env.DB_USERNAME = DB_USERNAME
  env.DEV = NODE_ENV === NodeEnv.DEV
  env.HOST = HOST || `https://${env.HOSTNAME}:${env.PORT}`
  env.SSL_CERT = SSL_CERT
  env.SSL_KEY = SSL_KEY
  env.SSL_PASSPHRASE = SSL_PASSPHRASE
  env.TEST = NODE_ENV === NodeEnv.TEST

  // Validate environment variables
  const errors: ValidationError[] = validateSync(env, {
    enableDebugMessages: true,
    forbidUnknownValues: true,
    stopAtFirstError: false,
    validationError: { target: false }
  })

  // Throw errors if found
  if (errors.length > 0) throw errors

  // Return validated environment variables as plain object
  return classToPlain(env) as EnvironmentVariables
}

/**
 * Returns an object containing the application's environment variables.
 *
 * @param {NodeEnv} [NODE_ENV] - Stub Node environment
 * @param {NumberString} [PORT] - Stub port to run application on
 * @return {EnvironmentVariables} **Validated** environment variables
 */
const configuration = (
  NODE_ENV?: NodeEnv,
  PORT?: NumberString
): EnvironmentVariables => {
  return validate({
    DB_AUTO_LOAD_MODELS: process.env.DB_AUTO_LOAD_MODELS,
    DB_HOST: process.env.DB_HOST,
    DB_LOG_QUERY_PARAMS: process.env.DB_LOG_QUERY_PARAMS,
    DB_LOGGING: process.env.DB_LOGGING,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_TIMEZONE: process.env.DB_TIMEZONE,
    DB_USERNAME: process.env.DB_USERNAME,
    HOST: process.env.HOST,
    HOSTNAME: process.env.HOSTNAME,
    NODE_ENV: NODE_ENV || process.env.NODE_ENV,
    PORT: isNIL(PORT) ? process.env.PORT : PORT.toString(),
    SSL_CERT: process.env.SSL_CERT,
    SSL_KEY: process.env.SSL_KEY,
    SSL_PASSPHRASE: process.env.SSL_PASSPHRASE
  })
}

/** @property {EnvironmentVariables} ENV - Application environment variables */
const ENV: EnvironmentVariables = configuration()

export { ENV, ENV_FILE_PATH, configuration as default, validate }
