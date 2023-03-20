/**
 * @file Providers - AppService
 * @module sneusers/providers/AppService
 */

import { EnvironmentVariables } from '#src/models'
import { Exception } from '@flex-development/exceptions'
import { AppEnv, NodeEnv, type ObjectPlain } from '@flex-development/tutils'
import {
  HttpStatus,
  Injectable,
  type NestApplicationOptions
} from '@nestjs/common'
import { ConfigService, type ConfigModuleOptions } from '@nestjs/config'
import { instanceToPlain } from 'class-transformer'
import { ValidationError, validateSync } from 'class-validator'

/**
 * Main application service.
 *
 * @class
 */
@Injectable()
class AppService {
  /**
   * Instantiates a new application service.
   *
   * @param {ConfigService<EnvironmentVariables, true>} config - Config service
   */
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Get the options used to create the NestJS application.
   *
   * @public
   * @static
   *
   * @return {NestApplicationOptions} NestJS application options
   */
  public static get options(): NestApplicationOptions {
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
   * [`ConfigModule`][1] options.
   *
   * [1]: https://docs.nestjs.com/techniques/configuration
   *
   * @public
   * @static
   *
   * @return {ConfigModuleOptions} `ConfigModule` options
   */
  public static get optionsConfigModule(): ConfigModuleOptions {
    const { APP_ENV, NODE_ENV } = process.env

    return {
      cache: APP_ENV === AppEnv.PROD && NODE_ENV === NodeEnv.PROD,
      envFilePath: [],
      expandVariables: true,
      ignoreEnvFile: true,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [() => new EnvironmentVariables(process.env)],
      /**
       * Environment variable validator.
       *
       * @param {ObjectPlain} obj - Object containing environment variables
       * @return {EnvironmentVariables} Validated environment variables
       * @throws {Exception<ValidationError>}
       */
      validate(obj: ObjectPlain): EnvironmentVariables {
        /**
         * Environment variables.
         *
         * @const {EnvironmentVariables} env
         */
        const env: EnvironmentVariables = new EnvironmentVariables(obj)

        /**
         * Validation errors.
         *
         * @const {ValidationError[]} errors
         */
        const errors: ValidationError[] = validateSync(env, {
          enableDebugMessages: true,
          forbidUnknownValues: true,
          skipNullProperties: false,
          skipUndefinedProperties: false,
          stopAtFirstError: false,
          validationError: { target: false }
        })

        // throw if validation errors were encountered
        if (errors.length > 0) {
          /**
           * Validation error message.
           *
           * @const {string} message
           */
          const message: string = 'Environment variable validation failed'

          throw new Exception<ValidationError>(message, { errors })
        }

        return instanceToPlain(env) as EnvironmentVariables
      }
    }
  }
}

export default AppService
