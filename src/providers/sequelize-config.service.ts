import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SequelizeOptionsFactory } from '@nestjs/sequelize'
import {
  SequelizeModuleAsyncOptions,
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
   * Get `SequelizeModule` configuration options.
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
    const DB_NAME = this.config.get<string>('DB_NAME')

    const options: SequelizeModuleOptions = {
      autoLoadModels: this.config.get<boolean>('DB_AUTO_LOAD_MODELS'),
      benchmark: true,
      database: DB_NAME,
      define: {
        createdAt: 'created_at',
        defaultScope: { order: [['id', OrderDirection.ASC]] },
        deletedAt: 'deleted_at',
        underscored: true,
        updatedAt: 'updated_at'
      },
      dialect: 'postgres',
      dialectOptions: { application_name: DB_NAME },
      host: this.config.get<string>('DB_HOST'),
      logQueryParameters: this.config.get<boolean>('DB_LOG_QUERY_PARAMS'),
      logging: sql => console.log(sequelizeLogger(sql)),
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
      username: this.config.get<string>('DB_USERNAME')
    }

    if (this.config.get<boolean>('TEST')) {
      const dialectOptions: NonNullable<typeof options['dialectOptions']> = {
        readWriteMode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
      }

      options.dialect = 'sqlite'
      options.dialectOptions = dialectOptions
      options.logging = noop
      options.storage = `./db/data/${DB_NAME}.db`

      delete options.timezone
    }

    return options
  }
}
