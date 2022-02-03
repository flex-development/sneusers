import { AppEnv, NodeEnv } from '@sneusers/enums'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
  @IsOptional()
  APP_ENV: AppEnv

  /**
   * Maximum number of responses to store in the cache.
   *
   * @default 100
   */
  @IsNumber()
  @IsOptional()
  CACHE_MAX: number

  /**
   * Amount of time a response is cached before it is deleted (in seconds).
   *
   * Subsequent requests will go to the route handler and refresh the cache.
   *
   * @default 5
   */
  @IsNumber()
  @IsOptional()
  CACHE_TTL: number

  /**
   * Automatically load database models.
   *
   * @see https://docs.nestjs.com/techniques/database#auto-load-models
   *
   * @default true
   */
  @IsBoolean()
  @IsOptional()
  DB_AUTO_LOAD_MODELS: boolean

  /**
   * Hostname of database to connect to.
   *
   * @default 'postgres'
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  DB_HOST: string

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
  @IsOptional()
  DB_PASSWORD?: string

  /**
   * Port of database to connect to.
   *
   * @default 5432
   */
  @IsNumber()
  @IsOptional()
  DB_PORT: number

  /**
   * Timezone used when converting a date from the database into a JavaScript
   * {@link Date} object.
   *
   * @default '-05:00'
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
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
  @IsOptional()
  EMAIL_HOST: string

  /**
   * Port to send emails from.
   *
   * @default 465
   */
  @IsNumber()
  @IsOptional()
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
  @IsOptional()
  HOSTNAME: string

  /**
   * Access token expiration time (in seconds).
   *
   * @default 900
   */
  @IsNumber()
  @IsOptional()
  JWT_EXP_ACCESS: number

  /**
   * Refresh token expiration time (in seconds).
   *
   * @default 86400
   */
  @IsNumber()
  @IsOptional()
  JWT_EXP_REFRESH: number

  /**
   * Verification token expiration time (in seconds).
   *
   * @default 86400
   */
  @IsNumber()
  @IsOptional()
  JWT_EXP_VERIFY: number

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
  JWT_SECRET_VERIFY: string

  /**
   * Node environment.
   *
   * @default NodeEnv.DEV
   */
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv

  /**
   * Port to run application on.
   *
   * @default 8080
   */
  @IsNumber()
  @IsOptional()
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
   * @see https://github.com/redis/node-redis/tree/v3.0.2
   *
   * @default 'redis'
   */
  @IsString()
  @IsOptional()
  REDIS_HOST: string

  /**
   * Redis password.
   *
   * Defaults to `'redis'` in `development` and `test` environments.
   */
  @IsString()
  @IsNotEmpty()
  REDIS_PASSWORD: string

  /**
   * Port [Redis][1] server is running on.
   *
   * [1]: https://redis.io
   *
   * @see https://github.com/redis/node-redis/tree/v3.0.2
   *
   * @default 6379
   */
  @IsNumber()
  @IsOptional()
  REDIS_PORT: number

  /**
   * Development server description.
   *
   * @default 'Development server (local only)'
   */
  @IsString()
  @IsOptional()
  SERVER_DESCRIP_DEV: string

  /**
   * Production server description.
   *
   * @default 'Production server'
   */
  @IsString()
  @IsOptional()
  SERVER_DESCRIP_PROD: string

  /**
   * Staging server description.
   *
   * @default 'Staging server'
   */
  @IsString()
  @IsOptional()
  SERVER_DESCRIP_STG: string

  /**
   * Development server URL.
   *
   * @default `https://api.dev.${TLD}`
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  SERVER_URL_DEV: string

  /**
   * Production server URL.
   *
   * @default `https://api.${TLD}`
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  SERVER_URL_PROD: string

  /**
   * Staging server URL.
   *
   * @default `https://api.stg.${TLD}`
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
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
  @IsOptional()
  THROTTLE_LIMIT: number

  /**
   * Number of seconds that each request will last in storage.
   *
   * @see https://docs.nestjs.com/security/rate-limiting#configuration
   *
   * @default 60
   */
  @IsNumber()
  @IsOptional()
  THROTTLE_TTL: number

  /**
   * Top-level domain.
   */
  @IsString()
  @IsNotEmpty()
  TLD: string
}

export default EnvironmentVariables
