import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateIf
} from 'class-validator'

/**
 * @file Models - EnvironmentVariables
 * @module sneusers/models/EnvironmentVariables
 */

/** @property {boolean} PROD - Production environment check */
const PROD = (() => {
  const LOCALHOST = process.env.HOSTNAME?.includes('localhost') ?? true
  return process.env.NODE_ENV === NodeEnv.PROD && !LOCALHOST
})()

/**
 * Environment variables used by this application.
 */
class EnvironmentVariables {
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
   * Host of database to connect to.
   *
   * @default 'localhost'
   */
  @IsString()
  @IsNotEmpty()
  @ValidateIf(() => PROD)
  DB_HOST: string

  /**
   * Log SQL queries.
   *
   * @default true
   */
  @IsBoolean()
  DB_LOGGING: boolean

  /**
   * Show query binding parameters in log.
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
   * Password used to authenticate against the database to connect to.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ValidateIf(() => PROD)
  DB_PASSWORD: string

  /**
   * Port of database to connect to.
   *
   * @default 3306
   */
  @IsNumber()
  @ValidateIf(() => PROD)
  DB_PORT: number

  /**
   * Timezone used when converting a date from the database into a JavaScript
   * {@link Date} object.
   *
   * @default '-05:00'
   */
  @IsString()
  @IsNotEmpty()
  @ValidateIf(() => PROD)
  DB_TIMEZONE: string

  /**
   * Username used to authenticate against the database to connect to.
   */
  @IsString()
  @IsNotEmpty()
  @ValidateIf(() => PROD)
  DB_USERNAME: string

  /**
   * Indicates if application is running in `development` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  DEV: boolean

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
  HOSTNAME: string

  /**
   * Current Node environment.
   *
   * @default NodeEnv.ENV
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
   * Indicates if application is running in local `production` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  PROD_LOCAL: boolean

  /**
   * Indicates if application is running in `test` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  TEST: boolean
}

export default EnvironmentVariables
