import type { NumberString } from '@flex-development/tutils'
import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import isNIL from '@flex-development/tutils/guards/is-nil.guard'
import Protocol from '@sneusers/enums/protocol.enum'
import { EnvironmentVariables } from '@sneusers/models'
import { classToPlain } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'
import { config } from 'dotenv-defaults'
import expand from 'dotenv-expand'

/**
 * @file Configuration - Environment Variables
 * @module sneusers/config/configuration
 * @see https://docs.nestjs.com/techniques/configuration
 */

/** @property {string[]} ENV_FILE_PATH - Custom environment files */
const ENV_FILE_PATH = [process.env.NODE_ENV as string].flatMap((e: string) => [
  `${process.cwd()}/.env.${e}.local`,
  `${process.cwd()}/.env.${e}`,
  `${process.cwd()}/.env.local`,
  `${process.cwd()}/.env.defaults`
])

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
  PORT = '8080'
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

  // Set network protocol
  env.PROTOCOL = Protocol[`HTTP${env.PROD ? 'S' : ''}`]

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
  env.HOST = HOST || `${env.PROTOCOL}://${env.HOSTNAME}:${env.PORT}`
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
  // Load environment variables
  for (const path of ENV_FILE_PATH) expand(config({ path }))

  // Get environment variables
  const ENV = Object.assign({}, process.env)

  // Override Node environment
  if (!isNIL(NODE_ENV)) ENV.NODE_ENV = NODE_ENV

  // Override port
  if (!isNIL(PORT)) ENV.PORT = PORT.toString()

  return validate(ENV)
}

/** @property {EnvironmentVariables} ENV - Application environment variables */
const ENV: EnvironmentVariables = configuration()

export { ENV, ENV_FILE_PATH, configuration as default, validate }
