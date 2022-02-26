import type { AppEnv } from '@flex-development/tutils/enums'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SequelizeOptionsFactory } from '@nestjs/sequelize'
import {
  SequelizeModuleAsyncOptions,
  SequelizeModuleOptions
} from '@nestjs/sequelize'
import type { EnvironmentVariables } from '@sneusers/models'
import SEQUELIZE_CONFIG from '../config/sequelize.config'

/**
 * @file DatabaseModule Providers - SequelizeConfigService
 * @module sneusers/modules/db/providers/SequelizeConfigService
 */

@Injectable()
class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Get [`SequelizeModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/database#sequelize-integration
   *
   * @see https://github.com/nestjs/sequelize
   *
   * @static
   * @return {SequelizeModuleAsyncOptions} Module options
   */
  static get moduleOptions(): SequelizeModuleAsyncOptions {
    return { useClass: SequelizeConfigService }
  }

  /**
   * Get [`Sequelize`][1] options.
   *
   * [1]: https://sequelize.org/v7
   *
   * @param {string} [name] - Name of database connection
   * @return {SequelizeModuleOptions} Sequelize configuration options
   */
  createSequelizeOptions(name?: string): SequelizeModuleOptions {
    const migrate = this.config.get<boolean>('DB_MIGRATE')
    const migrations = SEQUELIZE_CONFIG[this.config.get<AppEnv>('APP_ENV')]

    return {
      ...migrations,
      autoLoadModels: this.config.get<boolean>('DB_AUTO_LOAD_MODELS'),
      name,
      repositoryMode: !this.config.get<boolean>('TEST'),
      retryAttempts: this.config.get<number>('DB_RETRY_ATTEMPTS'),
      retryDelay: this.config.get<number>('DB_RETRY_DELAY'),
      synchronize: migrate ? false : this.config.get<boolean>('DB_SYNCHRONIZE'),
      typeValidation: true,
      validateOnly: false
    }
  }
}

export default SequelizeConfigService
