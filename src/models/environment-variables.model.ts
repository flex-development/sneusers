import { NodeEnv } from '@sneusers/enums'
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
   * Maximum number of responses to store in the cache.
   *
   * @default 100
   */
  @IsNumber()
  @IsOptional()
  CACHE_MAX: number

  /**
   * Amount of time in seconds that a response is cached before it is deleted.
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
   * Host of database to connect to.
   *
   * @default 'localhost'
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
   * Password used to authenticate against the database to connect to.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @IsOptional()
  DB_PASSWORD?: string

  /**
   * Port of database to connect to.
   *
   * @default 3306
   */
  @IsNumber()
  @IsOptional()
  DB_PORT: number

  /**
   * Username used to authenticate against the database to connect to.
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
   * Email host server.
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
   * Application URL.
   *
   * @default `${'http'|'https'}://${HOSTNAME}:${PORT}`
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
   * User access token expiration time.
   *
   * @default 900
   */
  @IsNumber()
  @IsOptional()
  JWT_EXP_ACCESS: number

  /**
   * User refresh token expiration time.
   *
   * @default 86400
   */
  @IsNumber()
  @IsOptional()
  JWT_EXP_REFRESH: number

  /**
   * User verification token expiration time.
   *
   * @default 86400
   */
  @IsNumber()
  @IsOptional()
  JWT_EXP_VERIFY: number

  /**
   * JWT access token signing secret.
   *
   * Defaults to `'JWT_SECRET'` in non-production environments.
   */
  @IsString()
  @IsNotEmpty()
  JWT_SECRET_ACCESS: string

  /**
   * JWT refresh token signing secret.
   *
   * Defaults to `'JWT_SECRET'` in non-production environments.
   */
  @IsString()
  @IsNotEmpty()
  JWT_SECRET_REFRESH: string

  /**
   * JWT verification token signing secret.
   *
   * Defaults to `'JWT_SECRET'` in non-production environments.
   */
  @IsString()
  @IsNotEmpty()
  JWT_SECRET_VERIFY: string

  /**
   * Current Node environment.
   *
   * @default NodeEnv.ENV
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
   * Indicates if application is running in local `production` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  PROD_LOCAL: boolean

  /**
   * IP address of the [Redis][1] server host.
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
   * Port to run [Redis][1] server on.
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
   * Indicates if application is running in `test` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  TEST: boolean

  /**
   * Maximum number of requests within the @see {@link THROTTLE_TTL} limit.
   *
   * @default 10
   */
  @IsNumber()
  @IsOptional()
  THROTTLE_LIMIT: number

  /**
   * Number of seconds that each request will last in storage.
   *
   * @default 60
   */
  @IsNumber()
  @IsOptional()
  THROTTLE_TTL: number
}

export default EnvironmentVariables
