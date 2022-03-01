import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SequelizeOptionsFactory } from '@nestjs/sequelize'
import {
  SequelizeModuleAsyncOptions,
  SequelizeModuleOptions
} from '@nestjs/sequelize'
import type { EnvironmentVariables } from '@sneusers/models'
import noop from '@stdlib/utils-noop'
import pg from 'pg'
import { Transaction } from 'sequelize'
import sequelizeLogger from 'sequelize-log-syntax-colors'
import { DatabaseDialect } from '../enums'
import {
  beforeConnect,
  beforeCreate,
  beforeSave,
  beforeValidate
} from '../hooks'

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
   * SQL statement logger.
   *
   * @param {string} sql - SQL statement
   * @return {string} Formatted and colorized SQL statement
   */
  static logging(sql: string): string {
    const SQL = sequelizeLogger(sql, { capitalizeKeywords: true })

    console.log(SQL)
    return SQL
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
    const options: SequelizeModuleOptions = {
      autoLoadModels: this.config.get<boolean>('DB_AUTO_LOAD_MODELS'),
      benchmark: true,
      database: this.config.get<string>('DB_NAME'),
      define: {
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
        underscored: true,
        updatedAt: 'updated_at'
      },
      dialect: DatabaseDialect.POSTGRES,
      dialectModule: pg,
      dialectOptions: {
        application_name: this.config.get<string>('PGAPPNAME')
      },
      hooks: {
        beforeConnect,
        beforeCreate,
        beforeSave,
        beforeValidate
      },
      host: this.config.get<string>('DB_HOST'),
      logQueryParameters: this.config.get<boolean>('DB_LOG_QUERY_PARAMS'),
      logging: SequelizeConfigService.logging,
      name,
      omitNull: false,
      password: this.config.get<string>('DB_PASSWORD'),
      port: this.config.get<number>('DB_PORT'),
      repositoryMode: true,
      retryAttempts: this.config.get<number>('DB_RETRY_ATTEMPTS'),
      retryDelay: this.config.get<number>('DB_RETRY_DELAY'),
      sync: {
        alter: this.config.get<boolean>('DB_SYNC_ALTER') && { drop: false },
        force: this.config.get<boolean>('DB_SYNC_FORCE')
      },
      synchronize: this.config.get<boolean>('DB_SYNCHRONIZE'),
      timezone: this.config.get<string>('DB_TIMEZONE'),
      transactionType: Transaction.TYPES.DEFERRED,
      typeValidation: true,
      username: this.config.get<string>('DB_USERNAME'),
      validateOnly: false
    }

    if (this.config.get<boolean>('TEST')) {
      options.logging = noop
      options.repositoryMode = false
    }

    if (this.config.get<boolean>('DB_MIGRATE')) {
      options.synchronize = false
    }

    return options
  }
}

export default SequelizeConfigService
