import { ClassProvider, Injectable } from '@nestjs/common'
import * as SequelizeModule from 'sequelize'
import { QueryInterface } from 'sequelize'
import { Sequelize as Sequelize } from 'sequelize-typescript'
import {
  InputMigrations,
  MigrationParams,
  RunnableMigration,
  SequelizeStorage,
  UmzugOptions
} from 'umzug'
import { UmzugOptionsFactory } from '../factories'
import SequelizeConfigService from './sequelize-config.service'

/**
 * @file DatabaseModule Providers - UmzugConfigService
 * @module sneusers/modules/db/providers/UmzugConfigService
 */

@Injectable()
class UmzugConfigService implements UmzugOptionsFactory {
  constructor(
    protected readonly config: SequelizeConfigService,
    protected readonly sequelize: Sequelize
  ) {}

  /**
   * Creates a {@link UmzugOptionsFactory} provider.
   *
   * @static
   * @return {ClassProvider<UmzugOptionsFactory>} Class provider
   */
  static createProvider(): ClassProvider<UmzugOptionsFactory> {
    return { provide: UmzugOptionsFactory, useClass: UmzugConfigService }
  }

  /**
   * Creates migration options.
   *
   * @return {InputMigrations<QueryInterface>} Input migration options
   */
  createInputMigrations(): InputMigrations<QueryInterface> {
    return {
      glob: './src/modules/db/migrations/*.ts',
      resolve: params => this.migrationResolver(this, params)
    }
  }

  /**
   * Creates the `sequelize` param for migration functions.
   *
   * @return {typeof SequelizeModule} Migration function `sequelize` param
   */
  createSequelize(): typeof SequelizeModule {
    // ! Fixes `sequelize.fn is not a function` error
    return Object.assign(SequelizeModule, { fn: SequelizeModule.Sequelize.fn })
  }

  /**
   * Get [`umzug`][1] options.
   *
   * [1]: https://github.com/sequelize/umzug
   *
   * @return {UmzugOptions<QueryInterface>} `umzug` options
   */
  createUmzugOptions(): UmzugOptions<QueryInterface> {
    return {
      context: this.sequelize.getQueryInterface(),
      logger: console,
      migrations: this.createInputMigrations(),
      storage: new SequelizeStorage({ sequelize: this.sequelize })
    }
  }

  /**
   * Resolves a migration.
   *
   * @param {UmzugConfigService} self - Current service
   * @param {MigrationParams<QueryInterface>} params - Migration parameters
   * @return {RunnableMigration<QueryInterface>} Migration object
   */
  migrationResolver(
    self: UmzugConfigService,
    params: MigrationParams<QueryInterface>
  ): RunnableMigration<QueryInterface> {
    const migration = require(`../migrations/${params.name}`).default
    const runnable = { name: params.name }

    return Object.assign(runnable, {
      down: async () => migration.down(params.context, self.createSequelize()),
      up: async () => migration.up(params.context, self.createSequelize())
    })
  }
}

export default UmzugConfigService
