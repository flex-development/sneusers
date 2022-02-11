import { AppEnv, NodeEnv } from '@flex-development/tutils/enums'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MinLength
} from 'class-validator'

/**
 * @file Models - EnvironmentVariables
 * @module sneusers/models/EnvironmentVariables
 */

/**
 * Environment variables used by this application.
 */
class EnvironmentVariables {
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
   * @default 100
   */
  @IsNumber()
  CACHE_MAX: number

  /**
   * Amount of time a response is cached before it is deleted (in seconds).
   *
   * Subsequent requests will go to the route handler and refresh the cache.
   *
   * @default 5
   */
  @IsNumber()
  CACHE_TTL: number

  /**
   * Cookie signing secret.
   *
   * Defaults to `'COOKIE_SECRET'` in `development` and `test` environments.
   */
  @IsString()
  @IsNotEmpty()
  COOKIE_SECRET: string

  /**
   * Number to use when calculating `Expires` `Set-Cookie` attribute (ms).
   *
   * @see https://github.com/expressjs/csurf#cookie
   *
   * @default 60000
   */
  @IsNumber()
  CSURF_COOKIE_MAX_AGE: number

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
   * Hostname of database to connect to.
   *
   * @default 'postgres'
   */
  @IsString()
  @IsNotEmpty()
  DB_HOST: string

  /**
   * Show database bind parameters in log.
   *
   * @default true
   */
  @IsBoolean()
  DB_LOG_QUERY_PARAMS: boolean

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
  @IsNotEmpty()
  @MinLength(4)
  DB_PASSWORD?: string

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
   *
   * @default '-05:00'
   */
  @IsString()
  @IsNotEmpty()
  DB_TIMEZONE: string

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
   * Google service account `client_id`.
   */
  @IsString()
  EMAIL_CLIENT: string

  /**
   * Hostname of email server.
   *
   * @default 'smtp.gmail.com'
   */
  @IsString()
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
  EMAIL_PRIVATE_KEY: string

  /**
   * Email address to send emails from.
   *
   * This address must be listed under "Send mail as" in {@link EMAIL_USER}'s,
   * Gmail account.
   *
   * @see https://support.google.com/mail/answer/22370?hl=en
   */
  @IsString()
  EMAIL_SEND_AS: string

  /**
   * Email address used to authenticate with Google APIs.
   */
  @IsString()
  EMAIL_USER: string

  /**
   * Application URL (includes scheme and `PORT` if applicable).
   *
   * @default `http://${HOSTNAME}:${PORT}`
   */
  @IsString()
  @IsNotEmpty()
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
  REDIS_HOST: string

  /**
   * Redis server password.
   *
   * Defaults to `'redis'` in `development` and `test` environments.
   */
  @IsString()
  @IsNotEmpty()
  REDIS_PASSWORD: string

  /**
   * Redis server username.
   *
   * @default 'ubuntu'
   */
  @IsString()
  @IsNotEmpty()
  REDIS_USER: string

  /**
   * Port [Redis][1] server is running on.
   *
   * [1]: https://redis.io
   *
   * @see https://github.com/redis/node-redis
   *
   * @default 6379
   */
  @IsNumber()
  REDIS_PORT: number

  /**
   * Development server description.
   *
   * @default 'Development server (local only)'
   */
  @IsString()
  SERVER_DESCRIP_DEV: string

  /**
   * Production server description.
   *
   * @default 'Production server'
   */
  @IsString()
  SERVER_DESCRIP_PROD: string

  /**
   * Staging server description.
   *
   * @default 'Staging server'
   */
  @IsString()
  SERVER_DESCRIP_STG: string

  /**
   * Current server URL.
   *
   * **Note**: This value is computed by the application.
   */
  @IsUrl()
  SERVER_URL: string

  /**
   * Development server URL.
   *
   * @default `https://api.dev.${TLD}`
   */
  @IsUrl()
  SERVER_URL_DEV: string

  /**
   * Production server URL.
   *
   * @default `https://api.${TLD}`
   */
  @IsUrl()
  SERVER_URL_PROD: string

  /**
   * Staging server URL.
   *
   * @default `https://api.stg.${TLD}`
   */
  @IsUrl()
  SERVER_URL_STG: string

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
