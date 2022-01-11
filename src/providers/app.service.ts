import { HttpStatus, Injectable, NestApplicationOptions } from '@nestjs/common'
import { ConfigModuleOptions, ConfigService } from '@nestjs/config'
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize'
import configuration, {
  ENV,
  ENV_FILE_PATH as envFilePath,
  validate
} from '@sneusers/config/configuration'
import type { EnvironmentVariables } from '@sneusers/models'
import SequelizeConfigService from './sequelize-config.service'

/**
 * @file Providers - AppService
 * @module sneusers/providers/AppService
 */

@Injectable()
export default class AppService {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Returns the application {@link ConfigModuleOptions}.
   *
   * @see https://docs.nestjs.com/techniques/configuration
   *
   * @return {ConfigModuleOptions} Application `ConfigModuleOptions`
   */
  static get configModuleOptions(): ConfigModuleOptions {
    return {
      cache: ENV.PROD,
      envFilePath,
      expandVariables: true,
      ignoreEnvFile: ENV.PROD,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [configuration],
      validate
    }
  }

  /**
   * Returns the options used to create the NestJS application.
   *
   * @static
   * @return {NestApplicationOptions} NestJS application options
   */
  static get options(): NestApplicationOptions {
    return {
      cors: {
        allowedHeaders: '*',
        methods: ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST'],
        optionsSuccessStatus: HttpStatus.ACCEPTED,
        origin: '*',
        preflightContinue: true
      }
    }
  }

  /**
   * Returns the application {@link SequelizeModuleAsyncOptions}.
   *
   * @see https://docs.nestjs.com/techniques/database#async-configuration-1
   *
   * @return {SequelizeModuleAsyncOptions} Application `SequelizeModule` options
   */
  static get sequelizeModuleOptions(): SequelizeModuleAsyncOptions {
    return { useClass: SequelizeConfigService }
  }
}
