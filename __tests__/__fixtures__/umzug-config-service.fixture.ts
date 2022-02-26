import { UmzugConfigService } from '@sneusers/modules/db/providers'
import config from './sequelize-config-service.fixture'
import sequelize from './sequelize.fixture'

/**
 * @file Global Test Fixture - UmzugConfigService
 * @module tests/fixtures/UmzugConfigService
 */

export default new UmzugConfigService(config, sequelize)
