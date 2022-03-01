import { Injectable } from '@nestjs/common'
import { QueryInterface } from 'sequelize'
import { Umzug } from 'umzug'
import UmzugConfigService from './umzug-config.service'

/**
 * @file DatabaseModule Providers - UmzugService
 * @module sneusers/modules/db/providers/UmzugService
 */

@Injectable()
class UmzugService {
  /**
   * @readonly
   * @property {Umzug<QueryInterface>} migrator - Umzug migrator instance
   */
  readonly migrator: Umzug<QueryInterface>

  /**
   * @readonly
   * @property {Umzug<QueryInterface>} seeder - Umzug seeder instance
   */
  readonly seeder: Umzug<QueryInterface>

  constructor(protected readonly config: UmzugConfigService) {
    this.migrator = new Umzug<QueryInterface>(config.createMigratorOptions())
    this.seeder = new Umzug<QueryInterface>(config.createSeederOptions())
  }
}

export default UmzugService
