import { ClassProvider, Injectable } from '@nestjs/common'
import { ENV } from '@sneusers/config/configuration'
import * as SequelizeModule from 'sequelize'
import { QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import {
  InputMigrations,
  MigrationParams,
  RunnableMigration,
  SequelizeStorage,
  UmzugOptions
} from 'umzug'
import SEQUELIZE_CONFIG from '../config/sequelize.config'
import { UmzugOptionsFactory } from '../factories'

/**
 * @file DatabaseModule Providers - UmzugConfigService
 * @module sneusers/modules/db/providers/UmzugConfigService
 */

@Injectable()
class UmzugConfigService implements UmzugOptionsFactory {
  constructor(protected readonly sequelize: Sequelize) {}

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
   * Creates a logger.
   *
   * @static
   * @return {UmzugOptions['logger']} Umzug logger
   */
  static get logger(): UmzugOptions['logger'] {
    return ENV.TEST ? undefined : console
  }

  /**
   * Creates migration file options.
   *
   * @return {InputMigrations<QueryInterface>} Input migration options
   */
  createInputMigrations(): InputMigrations<QueryInterface> {
    return {
      glob: './src/modules/db/migrations/*.ts',
      resolve: params => this.resolver(this, 'migrations', params)
    }
  }

  /**
   * Creates seed file options.
   *
   * @return {InputMigrations<QueryInterface>} Input migration options
   */
  createInputSeeds(): InputMigrations<QueryInterface> {
    return {
      glob: './src/modules/db/seeders/*.ts',
      resolve: params => this.resolver(this, 'seeders', params)
    }
  }

  /**
   * Get [`umzug`][1] migrator options.
   *
   * [1]: https://github.com/sequelize/umzug
   *
   * @return {UmzugOptions<QueryInterface>} `umzug` options
   */
  createMigratorOptions(): UmzugOptions<QueryInterface> {
    return {
      context: this.sequelize.getQueryInterface(),
      logger: UmzugConfigService.logger,
      migrations: this.createInputMigrations(),
      storage: new SequelizeStorage({
        sequelize: new Sequelize(this.sequelize.options),
        tableName: SEQUELIZE_CONFIG[ENV.APP_ENV].migrationStorageTableName
      })
    }
  }

  /**
   * Get [`umzug`][1] seeder options.
   *
   * [1]: https://github.com/sequelize/umzug
   *
   * @return {UmzugOptions<QueryInterface>} `umzug` options
   */
  createSeederOptions(): UmzugOptions<QueryInterface> {
    return {
      context: this.sequelize.getQueryInterface(),
      logger: UmzugConfigService.logger,
      migrations: this.createInputSeeds(),
      storage: new SequelizeStorage({
        sequelize: new Sequelize(this.sequelize.options),
        tableName: SEQUELIZE_CONFIG[ENV.APP_ENV].seederStorageTableName
      })
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
   * Resolves a migration.
   *
   * @param {UmzugConfigService} self - Current service
   * @param {'migrations' | 'seeders'} directory - Directory to search for files
   * @param {MigrationParams<QueryInterface>} params - Migration parameters
   * @return {RunnableMigration<QueryInterface>} Migration object
   */
  resolver(
    self: UmzugConfigService,
    directory: 'migrations' | 'seeders',
    params: MigrationParams<QueryInterface>
  ): RunnableMigration<QueryInterface> {
    const migration = require(`../${directory}/${params.name}`).default
    const runnable = { name: params.name }

    return Object.assign(runnable, {
      down: async () => migration.down(params.context, self.createSequelize()),
      up: async () => migration.up(params.context, self.createSequelize())
    })
  }
}

export default UmzugConfigService
