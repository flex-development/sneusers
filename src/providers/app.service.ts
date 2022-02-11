import { HttpStatus, Injectable, NestApplicationOptions } from '@nestjs/common'
import { ConfigModuleOptions, ConfigService } from '@nestjs/config'
import configuration, { ENV, validate } from '@sneusers/config/configuration'
import type { EnvironmentVariables } from '@sneusers/models'
import pkg from 'read-pkg'

/**
 * @file Providers - AppService
 * @module sneusers/providers/AppService
 */

@Injectable()
class AppService {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Get `ConfigModule` options.
   *
   * @static
   * @return {ConfigModuleOptions} Module options
   */
  static get configModuleOptions(): ConfigModuleOptions {
    return {
      cache: ENV.PROD,
      envFilePath: [],
      expandVariables: true,
      ignoreEnvFile: true,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [configuration],
      validate
    }
  }

  /**
   * Get the options used to create the NestJS application.
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
   * Returns `package.json` data.
   *
   * @return {Package & { app: string; org: string }} Package data
   */
  static get package(): Package & { app: string; org: string } {
    const data = pkg.sync({ normalize: false }) as Package
    const name = data.name.split('/')

    return { ...data, app: name[1] as string, org: name[0] as string }
  }
}

export default AppService
