import { JwtConfigService } from '@sneusers/subdomains/auth/providers'
import config from './config-service.fixture'

/**
 * @file Global Test Fixture - JwtConfigService
 * @module tests/fixtures/JwtConfigService
 */

export default new JwtConfigService(config)
