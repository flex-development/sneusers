import { ObjectPlain } from '@flex-development/tutils'
import { AppEnv, NodeEnv } from '@flex-development/tutils/enums'
import { EnvironmentVariables } from '@sneusers/models'
import { instanceToPlain } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'

/**
 * @file Configuration - Environment Variables
 * @module sneusers/config/configuration
 * @see https://docs.nestjs.com/techniques/configuration
 */

/**
 * Validates environment variables.
 *
 * @param {ObjectPlain} config - Object containing environment variables
 * @return {EnvironmentVariables} **Validated** environment variables
 * @throws {ValidationError[]}
 */
const validate = ({
  APP_ENV = AppEnv.DEV,
  CACHE_MAX = 100,
  CACHE_TTL = 5,
  COOKIE_SECRET,
  CSURF_COOKIE_MAX_AGE = 60_000,
  DB_AUTO_LOAD_MODELS = 'true',
  DB_HOST = 'postgres',
  DB_LOG_QUERY_PARAMS = true,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT = 5432,
  DB_RETRY_ATTEMPTS = 10,
  DB_RETRY_DELAY = 3000,
  DB_SYNC_ALTER = true,
  DB_SYNC_FORCE = false,
  DB_SYNCHRONIZE = true,
  DB_TIMEZONE = '-05:00',
  DB_USERNAME,
  EMAIL_CLIENT,
  EMAIL_HOST = 'smtp.gmail.com',
  EMAIL_PORT = 465,
  EMAIL_PRIVATE_KEY,
  EMAIL_SEND_AS,
  EMAIL_USER,
  HOST,
  HOSTNAME = 'localhost',
  JWT_EXP_ACCESS = 900,
  JWT_EXP_REFRESH = 86_400,
  JWT_EXP_VERIFICATION = 86_400,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  JWT_SECRET_VERIFICATION,
  NODE_ENV = NodeEnv.DEV,
  PORT = 8080,
  REDIS_HOST = 'redis',
  REDIS_PASSWORD,
  REDIS_PORT = 6379,
  REDIS_USERNAME = 'default',
  SERVER_DESCRIP_DEV = 'Development server (local only)',
  SERVER_DESCRIP_PROD = 'Production server',
  SERVER_DESCRIP_STG = 'Staging server',
  SERVER_URL_DEV,
  SERVER_URL_PROD,
  SERVER_URL_STG,
  THROTTLE_LIMIT = 10,
  THROTTLE_TTL = 60,
  TLD
}: ObjectPlain): EnvironmentVariables => {
  const env = new EnvironmentVariables()

  // Set application and  Node environment
  env.APP_ENV = APP_ENV
  env.NODE_ENV = NODE_ENV

  // Check if running in production or staging environment
  env.PROD = env.APP_ENV === AppEnv.PROD && env.NODE_ENV === NodeEnv.PROD
  env.STG = env.APP_ENV === AppEnv.STG
  const STGPROD = env.STG || env.PROD

  // Set hostname, port to run application on, and top level domain
  env.HOSTNAME = HOSTNAME
  env.PORT = Number.parseInt(PORT.toString())
  env.TLD = TLD

  // Set server URLs
  env.SERVER_URL_DEV = SERVER_URL_DEV || `https://api.dev.${env.TLD}`
  env.SERVER_URL_PROD = SERVER_URL_PROD || `https://api.${env.TLD}`
  env.SERVER_URL_STG = SERVER_URL_STG || `https://api.stg.${env.TLD}`
  env.SERVER_URL = ((): EnvironmentVariables['SERVER_URL'] => {
    if (env.APP_ENV === AppEnv.STG) return env.SERVER_URL_STG
    if (env.APP_ENV === AppEnv.PROD) return env.SERVER_URL_PROD
    return env.SERVER_URL_DEV
  })()

  // Provide defaults in development and test environments
  COOKIE_SECRET = (STGPROD && COOKIE_SECRET) || 'COOKIE_SECRET'
  JWT_SECRET_ACCESS = (STGPROD && JWT_SECRET_ACCESS) || 'JWT_SECRET'
  JWT_SECRET_REFRESH = (STGPROD && JWT_SECRET_REFRESH) || 'JWT_SECRET'
  JWT_SECRET_VERIFICATION = (STGPROD && JWT_SECRET_VERIFICATION) || 'JWT_SECRET'
  REDIS_PASSWORD = (STGPROD && REDIS_PASSWORD) || 'redis'

  // Assign remaining environment variables
  env.CACHE_MAX = Number.parseInt(`${CACHE_MAX}`)
  env.CACHE_TTL = Number.parseInt(`${CACHE_TTL}`)
  env.COOKIE_SECRET = COOKIE_SECRET
  env.CSURF_COOKIE_MAX_AGE = Number.parseInt(`${CSURF_COOKIE_MAX_AGE}`)
  env.DB_AUTO_LOAD_MODELS = JSON.parse(DB_AUTO_LOAD_MODELS)
  env.DB_HOST = DB_HOST
  env.DB_LOG_QUERY_PARAMS = JSON.parse(DB_LOG_QUERY_PARAMS)
  env.DB_NAME = DB_NAME
  env.DB_PASSWORD = DB_PASSWORD
  env.DB_PORT = Number.parseInt(`${DB_PORT}`)
  env.DB_RETRY_ATTEMPTS = Number.parseInt(`${DB_RETRY_ATTEMPTS}`)
  env.DB_RETRY_DELAY = Number.parseInt(`${DB_RETRY_DELAY}`)
  env.DB_SYNC_ALTER = JSON.parse(DB_SYNC_ALTER)
  env.DB_SYNC_FORCE = JSON.parse(DB_SYNC_FORCE)
  env.DB_SYNCHRONIZE = JSON.parse(DB_SYNCHRONIZE)
  env.DB_TIMEZONE = DB_TIMEZONE
  env.DB_USERNAME = DB_USERNAME
  env.DEV = env.APP_ENV === AppEnv.DEV && env.NODE_ENV === NodeEnv.DEV
  env.EMAIL_CLIENT = EMAIL_CLIENT
  env.EMAIL_HOST = EMAIL_HOST
  env.EMAIL_PORT = Number.parseInt(`${EMAIL_PORT}`)
  env.EMAIL_PRIVATE_KEY = EMAIL_PRIVATE_KEY!.replace(/\\n/g, '\n')
  env.EMAIL_SEND_AS = EMAIL_SEND_AS
  env.EMAIL_USER = EMAIL_USER
  env.HOST = HOST || `http://${env.HOSTNAME}:${env.PORT}`
  env.JWT_EXP_ACCESS = Number.parseInt(`${JWT_EXP_ACCESS}`)
  env.JWT_EXP_REFRESH = Number.parseInt(`${JWT_EXP_REFRESH}`)
  env.JWT_EXP_VERIFICATION = Number.parseInt(`${JWT_EXP_VERIFICATION}`)
  env.JWT_SECRET_ACCESS = JWT_SECRET_ACCESS
  env.JWT_SECRET_REFRESH = JWT_SECRET_REFRESH
  env.JWT_SECRET_VERIFICATION = JWT_SECRET_VERIFICATION
  env.REDIS_HOST = REDIS_HOST
  env.REDIS_PASSWORD = REDIS_PASSWORD
  env.REDIS_PORT = Number.parseInt(`${REDIS_PORT}`)
  env.REDIS_USERNAME = REDIS_USERNAME
  env.SERVER_DESCRIP_DEV = SERVER_DESCRIP_DEV
  env.SERVER_DESCRIP_PROD = SERVER_DESCRIP_PROD
  env.SERVER_DESCRIP_STG = SERVER_DESCRIP_STG
  env.TEST = env.APP_ENV === AppEnv.TEST || env.NODE_ENV === NodeEnv.TEST
  env.THROTTLE_LIMIT = Number.parseInt(`${THROTTLE_LIMIT}`)
  env.THROTTLE_TTL = Number.parseInt(`${THROTTLE_TTL}`)

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
  return instanceToPlain(env) as EnvironmentVariables
}

/**
 * Returns an object containing the application's environment variables.
 *
 * @return {EnvironmentVariables} **Validated** environment variables
 */
const configuration = (): EnvironmentVariables => {
  return validate({
    APP_ENV: process.env.APP_ENV,
    CACHE_MAX: process.env.CACHE_MAX,
    CACHE_TTL: process.env.CACHE_TTL,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    CSURF_COOKIE_MAX_AGE: process.env.CSURF_COOKIE_MAX_AGE,
    DB_AUTO_LOAD_MODELS: process.env.DB_AUTO_LOAD_MODELS,
    DB_HOST: process.env.DB_HOST,
    DB_LOG_QUERY_PARAMS: process.env.DB_LOG_QUERY_PARAMS,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_RETRY_ATTEMPTS: process.env.DB_RETRY_ATTEMPTS,
    DB_RETRY_DELAY: process.env.DB_RETRY_DELAY,
    DB_SYNC_ALTER: process.env.DB_SYNC_ALTER,
    DB_SYNC_FORCE: process.env.DB_SYNC_FORCE,
    DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
    DB_TIMEZONE: process.env.DB_TIMEZONE,
    DB_USERNAME: process.env.DB_USERNAME,
    EMAIL_CLIENT: process.env.EMAIL_CLIENT,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_PRIVATE_KEY: process.env.EMAIL_PRIVATE_KEY,
    EMAIL_SEND_AS: process.env.EMAIL_SEND_AS,
    EMAIL_USER: process.env.EMAIL_USER,
    HOST: process.env.HOST,
    HOSTNAME: process.env.HOSTNAME,
    JWT_EXP_ACCESS: process.env.JWT_EXP_ACCESS,
    JWT_EXP_REFRESH: process.env.JWT_EXP_REFRESH,
    JWT_EXP_VERIFICATION: process.env.JWT_EXP_VERIFICATION,
    JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS,
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH,
    JWT_SECRET_VERIFICATION: process.env.JWT_SECRET_VERIFICATION,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    SERVER_DESCRIP_DEV: process.env.SERVER_DESCRIP_DEV,
    SERVER_DESCRIP_PROD: process.env.SERVER_DESCRIP_PROD,
    SERVER_DESCRIP_STG: process.env.SERVER_DESCRIP_STG,
    SERVER_URL_DEV: process.env.SERVER_URL_DEV,
    SERVER_URL_PROD: process.env.SERVER_URL_PROD,
    SERVER_URL_STG: process.env.SERVER_URL_STG,
    THROTTLE_LIMIT: process.env.THROTTLE_LIMIT,
    THROTTLE_TTL: process.env.THROTTLE_TTL,
    TLD: process.env.TLD
  })
}

/** @property {EnvironmentVariables} ENV - Application environment variables */
const ENV: EnvironmentVariables = configuration()

export { ENV, configuration as default, validate }
