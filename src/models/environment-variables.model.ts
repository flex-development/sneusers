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
   * Indicates if application is running in `test` Node environment.
   *
   * **Note**: This value is computed by the application.
   */
  @IsBoolean()
  TEST: boolean
}

export default EnvironmentVariables
