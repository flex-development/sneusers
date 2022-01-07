import { ConfigService } from '@nestjs/config'
import { SequelizeConfigService } from '@sneusers/providers'

/**
 * @file Global Test Fixture - SequelizeConfigService
 * @module tests/fixtures/SequelizeConfigService
 */

export default new SequelizeConfigService(new ConfigService())
