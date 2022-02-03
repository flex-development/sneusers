import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SequelizeOptionsFactory } from '@nestjs/sequelize'
import {
  SequelizeModuleAsyncOptions as SequelizeAsyncOptions,
  SequelizeModuleOptions
} from '@nestjs/sequelize'
import { OrderDirection } from '@sneusers/enums'
import type { EnvironmentVariables } from '@sneusers/models'
import noop from '@stdlib/utils-noop'
import { Transaction } from 'sequelize'
import sequelizeLogger from 'sequelize-log-syntax-colors'
import sqlite3 from 'sqlite3'

/**
 * @file Providers - SequelizeConfigService
 * @module sneusers/providers/SequelizeConfigService
 */

@Injectable()
export default class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Returns the application [`SequelizeModule`][1] configuration options.
   *
   * [1]: https://docs.nestjs.com/techniques/database#sequelize-integration
   *
   * @static
   * @return {SequelizeAsyncOptions} Module config options
   */
  static get moduleOptions(): SequelizeAsyncOptions {
    return { useClass: SequelizeConfigService }
  }

  /**
   * Returns the application [`Sequelize`][1] options.
   *
   * [1]: https://sequelize.org/v7
   * [2]: https://docs.nestjs.com/techniques/database#sequelize-integration
   *
   * @param {string} [name] - Name of database connection
   * @return {SequelizeModuleOptions} [`SequelizeModule#forRoot`][2] options
   */
  createSequelizeOptions(name?: string): SequelizeModuleOptions {
    const autoLoadModels = this.config.get<boolean>('DB_AUTO_LOAD_MODELS')
    const database = this.config.get<string>('DB_NAME')
    const host = this.config.get<string>('DB_HOST')
    const password = this.config.get<string>('DB_PASSWORD')
    const port = this.config.get<number>('DB_PORT')
    const timezone = this.config.get<string>('DB_TIMEZONE')
    const username = this.config.get<string>('DB_USERNAME')

    const options: SequelizeModuleOptions = {
      autoLoadModels,
      benchmark: true,
      database,
      define: {
        createdAt: 'created_at',
        defaultScope: { order: [['id', OrderDirection.ASC]] },
        deletedAt: 'deleted_at',
        underscored: true,
        updatedAt: 'updated_at'
      },
      dialect: 'postgres',
      dialectOptions: { application_name: database },
      host,
      logQueryParameters: true,
      logging: sql => console.log(sequelizeLogger(sql)),
      name,
      omitNull: false,
      password,
      port,
      repositoryMode: true,
      retryAttempts: 3,
      retryDelay: 0,
      sync: { force: true },
      synchronize: autoLoadModels,
      timezone,
      transactionType: Transaction.TYPES.DEFERRED,
      typeValidation: true,
      username
    }

    if (this.config.get<boolean>('TEST')) {
      const dialectOptions: NonNullable<typeof options['dialectOptions']> = {
        readWriteMode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
      }

      options.dialect = 'sqlite'
      options.dialectOptions = dialectOptions
      options.logging = noop
      options.storage = `./db/data/sqlite/${database}.db`

      delete options.timezone
    }

    return options
  }
}
