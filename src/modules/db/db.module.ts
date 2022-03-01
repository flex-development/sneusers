import { Global, Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import type { EnvironmentVariables } from '@sneusers/models'
import { Sequelize } from 'sequelize-typescript'
import {
  SequelizeConfigService,
  UmzugConfigService,
  UmzugService
} from './providers'

/**
 * @file DatabaseModule
 * @module sneusers/modules/db/DatabaseModule
 */

@Global()
@Module({
  imports: [SequelizeModule.forRootAsync(SequelizeConfigService.moduleOptions)],
  providers: [
    SequelizeConfigService,
    UmzugConfigService,
    UmzugConfigService.createProvider(),
    UmzugService
  ]
})
export default class DatabaseModule implements OnModuleInit {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly umzug: UmzugService,
    protected readonly sequelize: Sequelize
  ) {}

  /**
   * Runs database migrations and seeders.
   *
   * @async
   * @return {Promise<void>} Empty promise when complete
   */
  async onModuleInit(): Promise<void> {
    if (this.config.get<boolean>('DB_MIGRATE')) {
      await this.umzug.migrator.up()
      await this.sequelize.sync(this.sequelize.options.sync)
    }

    if (this.config.get<boolean>('DEV')) await this.umzug.seeder.up()
  }
}
