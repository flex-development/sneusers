import sequelize from '@fixtures/sequelize.fixture'
import { ENV } from '@sneusers/config/configuration'
import { DatabaseTable } from '../enums'

/**
 * @file DatabaseModule Configuration - Sequelize
 * @module sneusers/modules/db/config/sequelize
 */

export = {
  [ENV.APP_ENV]: {
    ...sequelize.options,
    migrationStorageTableName: DatabaseTable.STORAGE_MIGRATIONS,
    seederStorage: 'sequelize',
    seederStorageTableName: DatabaseTable.STORAGE_SEEDERS
  }
}
