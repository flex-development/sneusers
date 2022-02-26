import { Global, Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import type { EnvironmentVariables } from '@sneusers/models'
import { Sequelize } from 'sequelize-typescript'
import { Umzug } from 'umzug'
import { UmzugOptionsFactory } from './factories'
import {
  SequelizeConfigService,
  UmzugConfigService,
  UmzugProvider
} from './providers'

/**
 * @file DatabaseModule
 * @module sneusers/modules/db/DatabaseModule
 */

@Global()
@Module({
  exports: [SequelizeConfigService, Umzug, UmzugOptionsFactory],
  imports: [SequelizeModule.forRootAsync(SequelizeConfigService.moduleOptions)],
  providers: [
    SequelizeConfigService,
    UmzugConfigService.createProvider(),
    UmzugProvider()
  ]
})
export default class DatabaseModule implements OnModuleInit {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly umzug: Umzug,
    protected readonly sequelize: Sequelize
  ) {}

  /**
   * Runs database migrations.
   *
   * @async
   * @return {Promise<void>} Empty promise when complete
   */
  async onModuleInit(): Promise<void> {
    if (this.config.get<boolean>('DB_MIGRATE')) {
      await this.umzug.up({
        migrations: (await this.umzug.pending()).map(meta => meta.name),
        rerun: 'ALLOW'
      })

      await this.sequelize.sync(this.sequelize.options.sync)
    }
  }
}
