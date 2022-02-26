import { UmzugConfigService } from '@sneusers/modules/db/providers'
import config from './sequelize-config-service.fixture'
import sequelize from './sequelize.fixture'

/**
 * @file Fixtures - UmzugConfigService
 * @module fixtures/UmzugConfigService
 */

export default new UmzugConfigService(config, sequelize)
