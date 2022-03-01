import { UmzugConfigService } from '@sneusers/modules/db/providers'
import sequelize from './sequelize.fixture'

/**
 * @file Fixtures - UmzugConfigService
 * @module fixtures/UmzugConfigService
 */

export default new UmzugConfigService(sequelize)
