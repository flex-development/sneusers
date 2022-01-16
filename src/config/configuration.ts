import type { NumberString } from '@flex-development/tutils'
import isNIL from '@flex-development/tutils/guards/is-nil.guard'
import { NodeEnv } from '@sneusers/enums'
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
  CACHE_MAX = 100,
  CACHE_TTL = 5,
  DB_AUTO_LOAD_MODELS = 'true',
  DB_HOST = 'localhost',
  DB_NAME,
  DB_PASSWORD,
  DB_PORT = 3306,
  DB_USERNAME,
  HOST,
  HOSTNAME = 'localhost',
  JWT_EXP_ACCESS = 900,
  JWT_EXP_REFRESH = 86_400,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  NODE_ENV = NodeEnv.DEV,
  PORT = 8080,
  THROTTLE_LIMIT = 10,
  THROTTLE_TTL = 60
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
  env.CACHE_MAX = Number.parseInt(CACHE_MAX.toString())
  env.CACHE_TTL = Number.parseInt(CACHE_TTL.toString())
  env.DB_AUTO_LOAD_MODELS = JSON.parse(DB_AUTO_LOAD_MODELS)
  env.DB_HOST = DB_HOST
  env.DB_NAME = DB_NAME
  env.DB_PASSWORD = DB_PASSWORD
  env.DB_PORT = Number.parseInt(DB_PORT.toString(), 10)
  env.DB_USERNAME = DB_USERNAME
  env.DEV = NODE_ENV === NodeEnv.DEV
  env.HOST = HOST || `http://${env.HOSTNAME}:${env.PORT}`
  env.JWT_EXP_ACCESS = Number.parseInt(JWT_EXP_ACCESS.toString())
  env.JWT_EXP_REFRESH = Number.parseInt(JWT_EXP_REFRESH.toString())
  env.JWT_SECRET_ACCESS = (env.PROD && JWT_SECRET_ACCESS) || 'JWT_SECRET'
  env.JWT_SECRET_REFRESH = (env.PROD && JWT_SECRET_REFRESH) || 'JWT_SECRET'
  env.TEST = NODE_ENV === NodeEnv.TEST
  env.THROTTLE_LIMIT = Number.parseInt(THROTTLE_LIMIT.toString())
  env.THROTTLE_TTL = Number.parseInt(THROTTLE_TTL.toString())

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
    CACHE_MAX: process.env.CACHE_MAX,
    CACHE_TTL: process.env.CACHE_TTL,
    DB_AUTO_LOAD_MODELS: process.env.DB_AUTO_LOAD_MODELS,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    HOST: process.env.HOST,
    HOSTNAME: process.env.HOSTNAME,
    JWT_EXP_ACCESS: process.env.JWT_EXP_ACCESS,
    JWT_EXP_REFRESH: process.env.JWT_EXP_REFRESH,
    JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS,
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH,
    NODE_ENV: NODE_ENV || process.env.NODE_ENV,
    PORT: isNIL(PORT) ? process.env.PORT : PORT.toString(),
    THROTTLE_LIMIT: process.env.THROTTLE_LIMIT,
    THROTTLE_TTL: process.env.THROTTLE_TTL
  })
}

/** @property {EnvironmentVariables} ENV - Application environment variables */
const ENV: EnvironmentVariables = configuration()

export { ENV, ENV_FILE_PATH, configuration as default, validate }
