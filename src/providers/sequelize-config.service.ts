import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SequelizeOptionsFactory } from '@nestjs/sequelize'
import { SequelizeModuleOptions } from '@nestjs/sequelize'
import { OrderDirection } from '@sneusers/enums'
import type { EnvironmentVariables } from '@sneusers/models'
import noop from '@stdlib/utils-noop'
import { Transaction } from 'sequelize'
import sequelizeLogger from 'sequelize-log-syntax-colors'
import sqlite3 from 'sqlite3'

/**
 * @file Providers - SequelizeConfigService
 * @module sneusers/providers/SequelizeConfigService
 * @see https://docs.nestjs.com/techniques/database#async-configuration-1
 */

@Injectable()
export default class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Returns [`Sequelize`][1] configuration options.
   *
   * [1]: https://sequelize.org/v7
   * [2]: https://docs.nestjs.com/techniques/database#sequelize-integration
   *
   * @param {string} [name] - Name of database connection
   * @return {SequelizeModuleOptions} [`SequelizeModule.forRoot`][2] options
   */
  createSequelizeOptions(name?: string): SequelizeModuleOptions {
    const autoLoadModels = this.config.get<boolean>('DB_AUTO_LOAD_MODELS')
    const database = this.config.get<string>('DB_NAME')
    const host = this.config.get<string>('DB_HOST')
    const password = this.config.get<string>('DB_PASSWORD')
    const port = this.config.get<number>('DB_PORT')
    const username = this.config.get<string>('DB_USERNAME')

    const options: SequelizeModuleOptions = {
      autoLoadModels,
      benchmark: true,
      database,
      define: {
        createdAt: 'created_at',
        defaultScope: { order: [['id', OrderDirection.ASC]] },
        omitNull: false,
        paranoid: false,
        timestamps: true,
        underscored: true,
        updatedAt: 'updated_at'
      },
      dialect: 'sqlite',
      dialectOptions: { mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE },
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
      storage: `./db/data/${database}.db`,
      sync: { force: true },
      synchronize: autoLoadModels,
      timezone: '+00:00',
      transactionType: Transaction.TYPES.DEFERRED,
      typeValidation: true,
      username
    }

    if (this.config.get<boolean>('TEST')) {
      delete options.timezone
      options.logging = noop
    }

    if (this.config.get<boolean>('PROD')) {
      delete options.sync
      options.synchronize = false
    }

    return options
  }
}
