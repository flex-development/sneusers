import { OrNil, OrUndefined } from '@flex-development/tutils'
import { AppEnv, NodeEnv } from '@flex-development/tutils/enums'
import { isNIL } from '@flex-development/tutils/guards'
import { EnvironmentVariables, ServerInfo } from '@sneusers/models'
import { DatabaseDialect } from '@sneusers/modules/db/enums'
import { SessionUnset } from '@sneusers/modules/middleware/enums'
import { isDockerEnv } from '@sneusers/utils'
import { instanceToPlain } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'
import fs from 'fs'
import validator from 'validator'

/**
 * @file Configuration - Environment Variables
 * @module sneusers/config/configuration
 * @see https://docs.nestjs.com/techniques/configuration
 */

/**
 * Parses `value`.
 *
 * @template T - Return type
 *
 * @param {OrNil<string>} [value] - Value to parse
 * @return {T} Normalized value
 */
function parse<T = any>(value?: OrNil<string>): T {
  if (value === 'false') return false as unknown as T
  if (value === 'null') return null as unknown as T
  if (value === 'true') return true as unknown as T
  if (value === 'undefined') return undefined as unknown as T
  if (isNIL(value)) return value as unknown as T
  if (validator.isNumeric(value)) return Number.parseInt(value) as unknown as T

  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Validates environment variables.
 *
 * @param {Record<string, OrUndefined<string>>} config - Environment variables
 * @return {EnvironmentVariables} **Validated** environment variables
 * @throws {ValidationError[]}
 */
const validate = ({
  API_SERVER_DESCRIP_DEV,
  API_SERVER_DESCRIP_PROD,
  API_SERVER_DESCRIP_STG,
  API_SERVER_URL_DEV,
  API_SERVER_URL_PROD,
  API_SERVER_URL_STG,
  APP_ENV = AppEnv.DEV,
  CACHE_MAX = '10',
  CACHE_TTL = '5',
  CI = 'false',
  COOKIE_SECRET,
  CSURF_COOKIE_HTTP_ONLY = 'false',
  CSURF_COOKIE_KEY = '_csrf',
  CSURF_COOKIE_MAX_AGE = '86400',
  CSURF_COOKIE_PATH = '/',
  CSURF_COOKIE_SAME_SITE = 'false',
  CSURF_COOKIE_SECURE = 'false',
  CSURF_COOKIE_SIGNED = 'false',
  DB_AUTO_LOAD_MODELS = 'true',
  DB_HOST,
  DB_LOG_QUERY_PARAMS = 'true',
  DB_MIGRATE = 'true',
  DB_NAME,
  DB_PASSWORD,
  DB_PORT = '5432',
  DB_RETRY_ATTEMPTS = '10',
  DB_RETRY_DELAY = '3000',
  DB_SYNC_ALTER = 'true',
  DB_SYNC_FORCE = 'false',
  DB_SYNCHRONIZE = 'true',
  DB_TIMEZONE,
  DB_USERNAME,
  EMAIL_CLIENT,
  EMAIL_HOST = 'smtp.gmail.com',
  EMAIL_PORT = '465',
  EMAIL_PRIVATE_KEY,
  EMAIL_SEND_AS,
  EMAIL_USER,
  GH_AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize',
  GH_CLIENT_ID,
  GH_CLIENT_SECRET,
  GH_SCOPES,
  GH_SCOPES_SEPARATOR = ' ',
  GH_TOKEN_URL = 'https://github.com/login/oauth/access_token',
  GH_USER_EMAIL_URL = 'https://api.github.com/user/emails',
  GH_USER_PROFILE_URL = 'https://api.github.com/user',
  GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPES,
  GOOGLE_SCOPES_SEPARATOR = ' ',
  GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token',
  GOOGLE_USER_PROFILE_URL = 'https://www.googleapis.com/oauth2/v3/userinfo',
  HOST,
  HOSTNAME = 'localhost',
  JWT_EXP_ACCESS = '900',
  JWT_EXP_REFRESH = '86400',
  JWT_EXP_VERIFICATION = '86400',
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  JWT_SECRET_VERIFICATION,
  NODE_ENV = NodeEnv.DEV,
  PGAPPNAME,
  PORT = '8080',
  REDIS_HOST = 'redis',
  REDIS_PASSWORD,
  REDIS_PORT = '6379',
  REDIS_USERNAME,
  SESSION_COOKIE_HTTP_ONLY = 'true',
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_PATH = '/',
  SESSION_COOKIE_SAME_SITE,
  SESSION_COOKIE_SECURE = 'false',
  SESSION_NAME = 'connect.sid',
  SESSION_PROXY,
  SESSION_RESAVE = 'true',
  SESSION_ROLLING = 'false',
  SESSION_SAVE_UNINITIALIZED = 'false',
  SESSION_SECRET,
  SESSION_UNSET = SessionUnset.KEEP,
  THROTTLE_LIMIT = '10',
  THROTTLE_TTL = '60',
  TLD
}: Record<string, OrUndefined<string>>): EnvironmentVariables => {
  const env = new EnvironmentVariables() as Partial<EnvironmentVariables>

  // Set application and  Node environment
  env.APP_ENV = parse<AppEnv>(APP_ENV)
  env.NODE_ENV = parse<NodeEnv>(NODE_ENV)

  // Check if running in CI environment and if Docker services are running
  env.CI = parse(CI) || false
  env.DOCKER = isDockerEnv()

  // Check if database server should be running locally
  env.DB_LOCAL = !env.CI && !env.DOCKER

  // Check if running in production, staging, or test environment
  env.PROD = env.APP_ENV === AppEnv.PROD && env.NODE_ENV === NodeEnv.PROD
  env.STG = env.APP_ENV === AppEnv.STG
  env.TEST = env.APP_ENV === AppEnv.TEST || env.NODE_ENV === NodeEnv.TEST

  // Set hostname, port to run application on, and top level domain
  env.HOSTNAME = HOSTNAME
  env.PORT = parse(PORT.toString())
  env.TLD = TLD

  // Set server descriptions and URLs
  env.API_SERVER_DESCRIP_DEV = parse(API_SERVER_DESCRIP_DEV)
  env.API_SERVER_DESCRIP_PROD = parse(API_SERVER_DESCRIP_PROD)
  env.API_SERVER_DESCRIP_STG = parse(API_SERVER_DESCRIP_STG)
  env.API_SERVER_URL_DEV = parse(API_SERVER_URL_DEV)
  env.API_SERVER_URL_PROD = parse(API_SERVER_URL_PROD)
  env.API_SERVER_URL_STG = parse(API_SERVER_URL_STG)

  // Set API servers
  env.API_SERVERS = ((): ServerInfo[] => {
    return [
      new ServerInfo(env.API_SERVER_URL_PROD, env.API_SERVER_DESCRIP_PROD),
      new ServerInfo(env.API_SERVER_URL_STG, env.API_SERVER_DESCRIP_STG),
      new ServerInfo(env.API_SERVER_URL_DEV, env.API_SERVER_DESCRIP_DEV)
    ].filter(server => server.url !== undefined)
  })()

  // Provide defaults in development and test environments
  if (!env.PROD && !env.STG) {
    JWT_SECRET_ACCESS = JWT_SECRET_ACCESS || 'JWT_SECRET'
    JWT_SECRET_REFRESH = JWT_SECRET_REFRESH || 'JWT_SECRET'
    JWT_SECRET_VERIFICATION = JWT_SECRET_VERIFICATION || 'JWT_SECRET'
    SESSION_SECRET = SESSION_SECRET || 'SESSION_SECRET'
  }

  // Assign remaining environment variables
  env.CACHE_MAX = parse(CACHE_MAX)
  env.CACHE_TTL = parse(CACHE_TTL)
  env.COOKIE_SECRET = parse(COOKIE_SECRET)
  env.CSURF_COOKIE_HTTP_ONLY = parse(CSURF_COOKIE_HTTP_ONLY)
  env.CSURF_COOKIE_KEY = CSURF_COOKIE_KEY
  env.CSURF_COOKIE_MAX_AGE = parse(CSURF_COOKIE_MAX_AGE)
  env.CSURF_COOKIE_PATH = CSURF_COOKIE_PATH
  env.CSURF_COOKIE_SAME_SITE = parse(CSURF_COOKIE_SAME_SITE)
  env.CSURF_COOKIE_SECURE = parse(CSURF_COOKIE_SECURE)
  env.CSURF_COOKIE_SIGNED = parse(CSURF_COOKIE_SIGNED)
  env.DB_AUTO_LOAD_MODELS = parse(DB_AUTO_LOAD_MODELS)
  env.DB_DIALECT = DatabaseDialect[env.TEST ? 'SQLITE' : 'POSTGRES']
  env.DB_HOST = env.DB_LOCAL ? process.env.PGHOST || DB_HOST : DB_HOST
  env.DB_LOG_QUERY_PARAMS = parse(DB_LOG_QUERY_PARAMS)
  env.DB_MIGRATIONS = ((): string[] => {
    const migrations = fs.readdirSync('./src/modules/db/migrations')
    return migrations.filter(migration => migration.endsWith('.ts'))
  })()
  env.DB_MIGRATE = parse(DB_MIGRATE)
  env.DB_NAME = DB_NAME
  env.DB_PASSWORD = DB_PASSWORD
  env.DB_PORT = parse(env.DB_LOCAL ? process.env.PGPORT || DB_PORT : DB_PORT)
  env.DB_RETRY_ATTEMPTS = parse(DB_RETRY_ATTEMPTS)
  env.DB_RETRY_DELAY = parse(DB_RETRY_DELAY)
  env.DB_SYNC_ALTER = parse(DB_SYNC_ALTER)
  env.DB_SYNC_FORCE = parse(DB_SYNC_FORCE)
  env.DB_SYNCHRONIZE = parse(DB_SYNCHRONIZE)
  env.DB_TIMEZONE = parse(DB_TIMEZONE)
  env.DB_USERNAME = DB_USERNAME
  env.DEV = env.APP_ENV === AppEnv.DEV && env.NODE_ENV === NodeEnv.DEV
  env.EMAIL_CLIENT = EMAIL_CLIENT
  env.EMAIL_HOST = EMAIL_HOST
  env.EMAIL_PORT = parse(EMAIL_PORT)
  env.EMAIL_PRIVATE_KEY = EMAIL_PRIVATE_KEY?.replace(/\\n/g, '\n')
  env.EMAIL_SEND_AS = EMAIL_SEND_AS
  env.EMAIL_USER = EMAIL_USER
  env.GH_AUTHORIZATION_URL = GH_AUTHORIZATION_URL
  env.GH_CLIENT_ID = GH_CLIENT_ID
  env.GH_CLIENT_SECRET = GH_CLIENT_SECRET
  env.GH_SCOPES = parse(GH_SCOPES)
  env.GH_SCOPES_SEPARATOR = GH_SCOPES_SEPARATOR
  env.GH_TOKEN_URL = GH_TOKEN_URL
  env.GH_USER_EMAIL_URL = GH_USER_EMAIL_URL
  env.GH_USER_PROFILE_URL = GH_USER_PROFILE_URL
  env.GOOGLE_AUTHORIZATION_URL = GOOGLE_AUTHORIZATION_URL
  env.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID
  env.GOOGLE_CLIENT_SECRET = GOOGLE_CLIENT_SECRET
  env.GOOGLE_SCOPES = GOOGLE_SCOPES
  env.GOOGLE_SCOPES_SEPARATOR = GOOGLE_SCOPES_SEPARATOR
  env.GOOGLE_TOKEN_URL = GOOGLE_TOKEN_URL
  env.GOOGLE_USER_PROFILE_URL = GOOGLE_USER_PROFILE_URL
  env.HOST = HOST || `http://${env.HOSTNAME}:${env.PORT}`
  env.JWT_EXP_ACCESS = parse(JWT_EXP_ACCESS)
  env.JWT_EXP_REFRESH = parse(JWT_EXP_REFRESH)
  env.JWT_EXP_VERIFICATION = parse(JWT_EXP_VERIFICATION)
  env.JWT_SECRET_ACCESS = JWT_SECRET_ACCESS
  env.JWT_SECRET_REFRESH = JWT_SECRET_REFRESH
  env.JWT_SECRET_VERIFICATION = JWT_SECRET_VERIFICATION
  env.PGAPPNAME = parse(PGAPPNAME)
  env.REDIS_HOST = REDIS_HOST
  env.REDIS_PASSWORD = parse(REDIS_PASSWORD)
  env.REDIS_PORT = parse(REDIS_PORT)
  env.REDIS_USERNAME = parse(REDIS_USERNAME)
  env.SESSION_COOKIE_HTTP_ONLY = parse(SESSION_COOKIE_HTTP_ONLY)
  env.SESSION_COOKIE_MAX_AGE = parse(SESSION_COOKIE_MAX_AGE)
  env.SESSION_COOKIE_PATH = SESSION_COOKIE_PATH
  env.SESSION_COOKIE_SAME_SITE = parse(SESSION_COOKIE_SAME_SITE)
  env.SESSION_COOKIE_SECURE = parse(SESSION_COOKIE_SECURE)
  env.SESSION_NAME = SESSION_NAME
  env.SESSION_PROXY = parse(SESSION_PROXY)
  env.SESSION_RESAVE = parse(SESSION_RESAVE)
  env.SESSION_ROLLING = parse(SESSION_ROLLING)
  env.SESSION_SAVE_UNINITIALIZED = parse(SESSION_SAVE_UNINITIALIZED)
  env.SESSION_SECRET = SESSION_SECRET
  env.SESSION_UNSET = parse<SessionUnset>(SESSION_UNSET)
  env.TEST = env.APP_ENV === AppEnv.TEST || env.NODE_ENV === NodeEnv.TEST
  env.THROTTLE_LIMIT = parse(THROTTLE_LIMIT)
  env.THROTTLE_TTL = parse(THROTTLE_TTL)

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
    API_SERVER_DESCRIP_DEV: process.env.API_SERVER_DESCRIP_DEV,
    API_SERVER_DESCRIP_PROD: process.env.API_SERVER_DESCRIP_PROD,
    API_SERVER_DESCRIP_STG: process.env.API_SERVER_DESCRIP_STG,
    API_SERVER_URL_DEV: process.env.API_SERVER_URL_DEV,
    API_SERVER_URL_PROD: process.env.API_SERVER_URL_PROD,
    API_SERVER_URL_STG: process.env.API_SERVER_URL_STG,
    APP_ENV: process.env.APP_ENV,
    CACHE_MAX: process.env.CACHE_MAX,
    CACHE_TTL: process.env.CACHE_TTL,
    CI: process.env.CI,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    CSURF_COOKIE_HTTP_ONLY: process.env.CSURF_COOKIE_HTTP_ONLY,
    CSURF_COOKIE_KEY: process.env.CSURF_COOKIE_KEY,
    CSURF_COOKIE_MAX_AGE: process.env.CSURF_COOKIE_MAX_AGE,
    CSURF_COOKIE_PATH: process.env.CSURF_COOKIE_PATH,
    CSURF_COOKIE_SAME_SITE: process.env.CSURF_COOKIE_SAME_SITE,
    CSURF_COOKIE_SECURE: process.env.CSURF_COOKIE_SECURE,
    CSURF_COOKIE_SIGNED: process.env.CSURF_COOKIE_SIGNED,
    DB_AUTO_LOAD_MODELS: process.env.DB_AUTO_LOAD_MODELS,
    DB_HOST: process.env.DB_HOST,
    DB_LOG_QUERY_PARAMS: process.env.DB_LOG_QUERY_PARAMS,
    DB_MIGRATE: process.env.DB_MIGRATE,
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
    GH_AUTHORIZATION_URL: process.env.GH_AUTHORIZATION_URL,
    GH_CLIENT_ID: process.env.GH_CLIENT_ID,
    GH_CLIENT_SECRET: process.env.GH_CLIENT_SECRET,
    GH_SCOPES: process.env.GH_SCOPES,
    GH_SCOPES_SEPARATOR: process.env.GH_SCOPES_SEPARATOR,
    GH_TOKEN_URL: process.env.GH_TOKEN_URL,
    GH_USER_EMAIL_URL: process.env.GH_USER_EMAIL_URL,
    GH_USER_PROFILE_URL: process.env.GH_USER_PROFILE_URL,
    GOOGLE_AUTHORIZATION_URL: process.env.GOOGLE_AUTHORIZATION_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_SCOPES: process.env.GOOGLE_SCOPES,
    GOOGLE_SCOPES_SEPARATOR: process.env.GOOGLE_SCOPES_SEPARATOR,
    GOOGLE_TOKEN_URL: process.env.GOOGLE_TOKEN_URL,
    GOOGLE_USER_PROFILE_URL: process.env.GOOGLE_USER_PROFILE_URL,
    HOST: process.env.HOST,
    HOSTNAME: process.env.HOSTNAME,
    JWT_EXP_ACCESS: process.env.JWT_EXP_ACCESS,
    JWT_EXP_REFRESH: process.env.JWT_EXP_REFRESH,
    JWT_EXP_VERIFICATION: process.env.JWT_EXP_VERIFICATION,
    JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS,
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH,
    JWT_SECRET_VERIFICATION: process.env.JWT_SECRET_VERIFICATION,
    NODE_ENV: process.env.NODE_ENV,
    PGAPPNAME: process.env.PGAPPNAME,
    PORT: process.env.PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    SESSION_COOKIE_HTTP_ONLY: process.env.SESSION_COOKIE_HTTP_ONLY,
    SESSION_COOKIE_MAX_AGE: process.env.SESSION_COOKIE_MAX_AGE,
    SESSION_COOKIE_PATH: process.env.SESSION_COOKIE_PATH,
    SESSION_COOKIE_SAME_SITE: process.env.SESSION_COOKIE_SAME_SITE,
    SESSION_COOKIE_SECURE: process.env.SESSION_COOKIE_SECURE,
    SESSION_PROXY: process.env.SESSION_PROXY,
    SESSION_RESAVE: process.env.SESSION_RESAVE,
    SESSION_ROLLING: process.env.SESSION_ROLLING,
    SESSION_SAVE_UNINITIALIZED: process.env.SESSION_SAVE_UNINITIALIZED,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_UNSET: process.env.SESSION_UNSET,
    THROTTLE_LIMIT: process.env.THROTTLE_LIMIT,
    THROTTLE_TTL: process.env.THROTTLE_TTL,
    TLD: process.env.TLD
  })
}

/** @property {EnvironmentVariables} ENV - Application environment variables */
const ENV: EnvironmentVariables = configuration()

export { ENV, configuration as default, validate }
