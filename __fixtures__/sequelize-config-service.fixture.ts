import { SequelizeConfigService } from '@sneusers/modules/db/providers'
import config from './config-service.fixture'

/**
 * @file Fixtures - SequelizeConfigService
 * @module fixtures/SequelizeConfigService
 */

export default new SequelizeConfigService(config)
