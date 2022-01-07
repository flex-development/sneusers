import { NodeEnv } from '@sneusers/enums'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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
  DB_PASSWORD: string

  /**
   * Port of database to connect to.
   *
   * @default 3306
   */
  @IsNumber()
  DB_PORT: number

  /**
   * Timezone used when converting a date from the database into a JavaScript
   * {@link Date} object.
   *
   * @default '-05:00'
   */
  @IsString()
  @IsNotEmpty()
  DB_TIMEZONE: string

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
