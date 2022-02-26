import type { OrUndefined } from '@flex-development/tutils'
import { AppEnv, NodeEnv } from '@flex-development/tutils/enums'
import { DatabaseDialect } from '@sneusers/modules/db/enums'
import {
  SameSitePolicy,
  SessionUnset
} from '@sneusers/modules/middleware/enums'
import type { SameSite } from '@sneusers/modules/middleware/types'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import ServerInfo from './server-info.model'

/**
 * @file Models - EnvironmentVariables
 * @module sneusers/models/EnvironmentVariables
 */

/**
 * Environment variables used by this application.
 */
class EnvironmentVariables {
  /**
   * Development server description.
   */
  @IsString()
  @IsOptional()
  API_SERVER_DESCRIP_DEV: OrUndefined<string>

  /**
   * Production server description.
   */
  @IsString()
  @IsOptional()
  API_SERVER_DESCRIP_PROD: OrUndefined<string>

  /**
   * Staging server description.
   */
  @IsString()
  @IsOptional()
  API_SERVER_DESCRIP_STG: OrUndefined<string>

  /**
   * Development server URL.
   */
  @IsUrl()
  @IsOptional()
  API_SERVER_URL_DEV: OrUndefined<string>

  /**
   * Production server URL.
   */
  @IsUrl()
  @IsOptional()
  API_SERVER_URL_PROD: OrUndefined<string>

  /**
   * Staging server URL.
   */
  @IsUrl()
  @IsOptional()
  API_SERVER_URL_STG: OrUndefined<string>

  /**
   * OpenAPI server documentation.
   *
   * @see https://swagger.io/docs/specification/api-host-and-base-path
   *
   * **Note**: This value is computed by the application and does **NOT**
   * support server variables.
   *
   * @default []
   */
  @ValidateNested({ each: true })
  API_SERVERS: ServerInfo[]

  /**
   * Application environment.
   *
   * @default AppEnv.DEV
   */
  @IsEnum(AppEnv)
  APP_ENV: AppEnv

  /**
   * Maximum number of responses to store in the cache.
   *
   * @default 10
   */
  @IsNumber()
  CACHE_MAX: number

  /**
   * Amount of time a response is cached before it is deleted (s).
   *
   * Subsequent requests will go to the route handler and refresh the cache.
   *
   * @default 5
   */
  @IsNumber()
  CACHE_TTL: number

  /**
   * Indicates if the application is running in a CI environment.
   *
   * @default false
   */
  @IsBoolean()
  CI: boolean

  /**
   * Cookie signing secret.
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  COOKIE_SECRET: OrUndefined<string>

  /**
   * Force csurf cookies to be accessible by the web server only.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default false
   */
  @IsBoolean()
  CSURF_COOKIE_HTTP_ONLY: boolean

  /**
   * Name of cookie to use to store csurf token secret.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default '_csrf'
   */
  @IsString()
  @IsNotEmpty()
  CSURF_COOKIE_KEY: string

  /**
   * Number to use when calculating csurf cookie expiration time (s).
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default 86400
   */
  @IsNumber()
  CSURF_COOKIE_MAX_AGE: number

  /**
   * csurf cookie path.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default '/'
   */
  @IsString()
  @IsNotEmpty()
  CSURF_COOKIE_PATH: string

  /**
   * csurf cookie same site policy.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default false
   */
  @IsEnum(SameSitePolicy)
  @IsOptional()
  @ValidateIf(o => typeof o.CSURF_COOKIE_SAME_SITE !== 'boolean')
  CSURF_COOKIE_SAME_SITE: SameSite

  /**
   * Force csurf cookies to be used over `HTTPS` only.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default false
   */
  @IsBoolean()
  CSURF_COOKIE_SECURE: boolean

  /**
   * Sign csurf cookies.
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default false
   */
  @IsBoolean()
  CSURF_COOKIE_SIGNED: boolean

  /**
   * Automatically load database models.
   *
   * @see https://docs.nestjs.com/techniques/database#auto-load-models
   *
   * @default true
   */
  @IsBoolean()
  DB_AUTO_LOAD_MODELS: boolean

  /**
   * Database dialect.
   *
   * **Note**: This value is computed by the application.
   */
  @IsEnum(DatabaseDialect)
  DB_DIALECT: DatabaseDialect

  /**
   * Hostname of database to connect to.
   */
  @IsString()
  DB_HOST: string

  /**
   * Indicates if the database server **should be** running locally.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  DB_LOCAL: boolean

  /**
   * Show database bind parameters in log.
   *
   * @default false
   */
  @IsBoolean()
  DB_LOG_QUERY_PARAMS: boolean

  /**
   * Database migration file names.
   *
   * **Note**: This value is computed by the application.
   */
  @IsString({ each: true })
  DB_MIGRATIONS: string[]

  /**
   * Run database migrations.
   *
   * @default false
   */
  @IsBoolean()
  DB_MIGRATE: boolean

  /**
   * Name of database to connect to.
   */
  @IsString()
  @IsNotEmpty()
  DB_NAME: string

  /**
   * Database password.
   */
  @IsString()
  @MinLength(4)
  DB_PASSWORD: string

  /**
   * Port of database to connect to.
   *
   * @default 5432
   */
  @IsNumber()
  DB_PORT: number

  /**
   * Number of attempts to connect to the database.
   *
   * @default 10
   */
  @IsNumber()
  DB_RETRY_ATTEMPTS: number

  /**
   * Delay between database connection retry attempts (ms).
   *
   * @default 3000
   */
  @IsNumber()
  DB_RETRY_DELAY: number

  /**
   * `ALTER` tables to fit database models during synchronization.
   *
   * Each data access object (DAO) will do `ALTER TABLE ... CHANGE ...`, but
   * will **NOT** delete data in columns that were removed or had their type
   * changed.
   *
   * Not recommended in `production` environments. Use [migrations][1] instead.
   *
   * [1]: https://sequelize.org/v7/manual/migrations
   *
   * @default true
   */
  @IsBoolean()
  DB_SYNC_ALTER: boolean

  /**
   * `DROP` existing tables before creating new tables during synchronization.
   *
   * Each data access object (DAO) will do `DROP TABLE IF EXISTS ...` before the
   * DAO tries to create its own table.
   *
   * Not recommended in `production` environments. Use [migrations][1] instead.
   *
   * [1]: https://sequelize.org/v7/manual/migrations
   *
   * @default false
   */
  @IsBoolean()
  DB_SYNC_FORCE: boolean

  /**
   * Automatically synchronize database models.
   *
   * Requires `DB_AUTO_LOAD_MODELS=true`.
   *
   * Not recommended in `production` environments. Use [migrations][1] instead.
   *
   * [1]: https://sequelize.org/v7/manual/migrations
   *
   * @see {@link EnvironmentVariables.DB_AUTO_LOAD_MODELS}
   *
   * @see https://docs.nestjs.com/techniques/database#auto-load-models
   *
   * @default true
   */
  @IsBoolean()
  DB_SYNCHRONIZE: boolean

  /**
   * Timezone to use when converting a date from the database into a JavaScript
   * {@link Date} object.
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  DB_TIMEZONE: OrUndefined<string>

  /**
   * Database user.
   */
  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string

  /**
   * Indicates if application is running in `development` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  DEV: boolean

  /**
   * Indicates if Docker services are running.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  DOCKER: boolean

  /**
   * Google service account `client_id`.
   */
  @IsString()
  @IsNotEmpty()
  EMAIL_CLIENT: string

  /**
   * Hostname of email server.
   *
   * @default 'smtp.gmail.com'
   */
  @IsString()
  @IsNotEmpty()
  EMAIL_HOST: string

  /**
   * Port to send emails from.
   *
   * @default 465
   */
  @IsNumber()
  EMAIL_PORT: number

  /**
   * Google service account `private_key`.
   */
  @IsString()
  @IsNotEmpty()
  EMAIL_PRIVATE_KEY: string

  /**
   * Email address to send emails from.
   *
   * This address must be listed under "Send mail as" in {@link EMAIL_USER}'s,
   * Gmail account.
   *
   * @see https://support.google.com/mail/answer/22370?hl=en
   */
  @IsEmail()
  EMAIL_SEND_AS: string

  /**
   * Email address used to authenticate with Google APIs.
   */
  @IsString()
  @IsNotEmpty()
  EMAIL_USER: string

  /**
   * GitHub OAuth authorization URL.
   *
   * @default 'https://github.com/login/oauth/authorize'
   */
  @IsUrl()
  GH_AUTHORIZATION_URL: string

  /**
   * GitHub OAuth client id.
   */
  @IsString()
  @IsNotEmpty()
  GH_CLIENT_ID: string

  /**
   * GitHub OAuth client id.
   */
  @IsString()
  @IsNotEmpty()
  GH_CLIENT_SECRET: string

  /**
   * List of GitHub OAuth scopes.
   *
   * @see https://docs.github.com/developers/apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes
   */
  @IsString()
  @IsOptional()
  GH_SCOPES: OrUndefined<string>

  /**
   * {@link EnvironmentVariables.GH_SCOPES} list separator.
   *
   * @default ' '
   */
  @IsString()
  GH_SCOPES_SEPARATOR: string

  /**
   * GitHub OAuth access token URL.
   *
   * @default 'https://github.com/login/oauth/access_token'
   */
  @IsUrl()
  GH_TOKEN_URL: string

  /**
   * GitHub OAuth user email URL.
   *
   * @default 'https://api.github.com/user/emails'
   */
  @IsUrl()
  GH_USER_EMAIL_URL: string

  /**
   * GitHub OAuth user profile URL.
   *
   * @default 'https://api.github.com/user'
   */
  @IsUrl()
  GH_USER_PROFILE_URL: string

  /**
   * Application URL (includes scheme and `PORT` if applicable).
   *
   * @default `http://${HOSTNAME}:${PORT}`
   */
  @IsUrl()
  HOST: string

  /**
   * Domain name of application URL.
   *
   * @default 'localhost'
   */
  @IsString()
  @IsNotEmpty()
  HOSTNAME: string

  /**
   * Access token expiration time (in seconds).
   *
   * @default 900
   */
  @IsNumber()
  JWT_EXP_ACCESS: number

  /**
   * Refresh token expiration time (in seconds).
   *
   * @default 86400
   */
  @IsNumber()
  JWT_EXP_REFRESH: number

  /**
   * Verification token expiration time (in seconds).
   *
   * @default 86400
   */
  @IsNumber()
  JWT_EXP_VERIFICATION: number

  /**
   * Access token signing secret.
   *
   * Defaults to `'JWT_SECRET'` in `development` and `test` environments.
   */
  @IsString()
  @IsNotEmpty()
  JWT_SECRET_ACCESS: string

  /**
   * Refresh token signing secret.
   *
   * Defaults to `'JWT_SECRET'` in `development` and `test` environments.
   */
  @IsString()
  @IsNotEmpty()
  JWT_SECRET_REFRESH: string

  /**
   * Verification token signing secret.
   *
   * Defaults to `'JWT_SECRET'` in `development` and `test` environments.
   */
  @IsString()
  @IsNotEmpty()
  JWT_SECRET_VERIFICATION: string

  /**
   * Node environment.
   *
   * @default NodeEnv.DEV
   */
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv

  /**
   * Postgres application name.
   *
   * @see https://postgresql.org/docs/14/libpq-envars.html
   *
   * @default undefined
   */
  @IsString()
  @IsOptional()
  PGAPPNAME: OrUndefined<string>

  /**
   * Port to run application on.
   *
   * @default 8080
   */
  @IsNumber()
  PORT: number

  /**
   * Indicates if application is running in `production` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  PROD: boolean

  /**
   * Hostname of [Redis][1] server.
   *
   * [1]: https://redis.io
   *
   * @see https://github.com/redis/node-redis
   *
   * @default 'redis'
   */
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string

  /**
   * Redis server password.
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  REDIS_PASSWORD: OrUndefined<string>

  /**
   * Redis server username.
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  REDIS_USERNAME: OrUndefined<string>

  /**
   * Port [Redis][1] server is running on.
   *
   * [1]: https://redis.io
   *
   * @default 6379
   */
  @IsNumber()
  REDIS_PORT: number

  /**
   * Force session cookies to be accessible by the web server only.
   *
   * @see https://github.com/expressjs/session#cookiehttponly
   *
   * @default true
   */
  @IsBoolean()
  SESSION_COOKIE_HTTP_ONLY: boolean

  /**
   * Number to use when calculating session cookie expiration time (s).
   *
   * @see https://github.com/expressjs/session#cookiemaxage
   *
   * @default undefined
   */
  @IsNumber()
  @IsOptional()
  @ValidateIf(o => o.SESSION_COOKIE_MAX_AGE !== undefined)
  SESSION_COOKIE_MAX_AGE: OrUndefined<number>

  /**
   * session cookie path.
   *
   * @see https://github.com/expressjs/session#cookiepath
   *
   * @default '/'
   */
  @IsString()
  @IsNotEmpty()
  SESSION_COOKIE_PATH: string

  /**
   * session cookie same site policy.
   *
   * @see https://github.com/expressjs/session#cookiesamesite
   *
   * @default undefined
   */
  @IsEnum(SameSitePolicy)
  @IsOptional()
  @ValidateIf(o => typeof o.SESSION_COOKIE_SAME_SITE !== 'boolean')
  SESSION_COOKIE_SAME_SITE: SameSite

  /**
   * Force session cookies to be used over `HTTPS` only.
   *
   * @see https://github.com/expressjs/session#cookiesecure
   *
   * @default false
   */
  @IsBoolean()
  SESSION_COOKIE_SECURE: boolean

  /**
   * Name of session ID cookie.
   *
   * @see https://github.com/expressjs/session#name
   *
   * @default 'connect.sid'
   */
  @IsString()
  @IsNotEmpty()
  SESSION_NAME: string

  /**
   * Trust the reverse proxy when setting secure session cookies.
   *
   * @see https://github.com/expressjs/session#proxy
   *
   * @default undefined
   */
  @IsBoolean()
  @IsOptional()
  SESSION_PROXY: OrUndefined<boolean>

  /**
   * Force sessions to be saved back to the session store, even if a session was
   * never modified during a request.
   *
   * @see https://github.com/expressjs/session#resave
   *
   * @default true
   */
  @IsBoolean()
  SESSION_RESAVE: boolean

  /**
   * Force the session identifier cookie to be set on every response.
   *
   * @see https://github.com/expressjs/session#rolling
   *
   * @default false
   */
  @IsBoolean()
  SESSION_ROLLING: boolean

  /**
   * Forces sessions that are "uninitialized" to be saved to the store.
   *
   * A session is uninitialized when it is new but not modified.
   *
   * @see https://github.com/expressjs/session#rolling
   *
   * @default true
   */
  @IsBoolean()
  SESSION_SAVE_UNINITIALIZED: boolean

  /**
   * Secret used to sign session ID cookies.
   *
   * Defaults to `'SESSION_SECRET'` in `development` and `test` environments.
   *
   * @see https://github.com/expressjs/session#secret
   */
  @IsString()
  @IsNotEmpty()
  SESSION_SECRET: string

  /**
   * Control the result of unsetting `req.session`.
   *
   * @see https://github.com/expressjs/session#unset
   *
   * @default SessionUnset.KEEP
   */
  @IsEnum(SessionUnset)
  SESSION_UNSET: SessionUnset

  /**
   * Indicates if application is running in a staging environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  STG: boolean

  /**
   * Indicates if application is running in `test` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  TEST: boolean

  /**
   * Maximum number of requests within the @see {@link THROTTLE_TTL} limit.
   *
   * @see https://docs.nestjs.com/security/rate-limiting#configuration
   *
   * @default 10
   */
  @IsNumber()
  THROTTLE_LIMIT: number

  /**
   * Number of seconds that each request will last in storage.
   *
   * @see https://docs.nestjs.com/security/rate-limiting#configuration
   *
   * @default 60
   */
  @IsNumber()
  THROTTLE_TTL: number

  /**
   * Top-level domain.
   */
  @IsString()
  @IsNotEmpty()
  TLD: string
}

export default EnvironmentVariables
