import { SequelizeConfigService } from '@sneusers/modules/db/providers'
import config from './config-service.fixture'

/**
 * @file Global Test Fixture - SequelizeConfigService
 * @module tests/fixtures/SequelizeConfigService
 */

export default new SequelizeConfigService(config)
