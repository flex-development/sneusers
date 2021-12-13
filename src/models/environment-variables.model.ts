import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator'

/**
 * @file Models - EnvironmentVariables
 * @module sneusers/models/EnvironmentVariables
 */

class EnvironmentVariables {
  @IsString()
  DESCRIPTION: string

  @IsBoolean()
  DEV: boolean

  @IsString()
  HOST: string

  @IsString()
  HOSTNAME: string

  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv

  @IsNumber()
  PORT: number

  @IsBoolean()
  PROD: boolean

  @IsString()
  PROTOCOL: string

  @IsBoolean()
  TEST: boolean

  @IsString()
  TITLE: string

  @IsString()
  VERSION: string
}

export default EnvironmentVariables
