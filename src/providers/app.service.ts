import { HttpStatus, Injectable, NestApplicationOptions } from '@nestjs/common'
import { ConfigModuleOptions, ConfigService } from '@nestjs/config'
import configuration, {
  ENV,
  ENV_FILE_PATH as envFilePath,
  validate
} from '@sneusers/config/configuration'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Providers - AppService
 * @module sneusers/providers/AppService
 */

@Injectable()
export default class AppService {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Returns the application [`ConfigModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/configuration
   *
   * @static
   * @return {ConfigModuleOptions} `ConfigModule` configuration options
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
}
