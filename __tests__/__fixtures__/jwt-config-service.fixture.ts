import { ConfigService } from '@nestjs/config'
import { JwtConfigService } from '@sneusers/subdomains/auth/providers'

/**
 * @file Global Test Fixture - JwtConfigService
 * @module tests/fixtures/JwtConfigService
 */

export default new JwtConfigService(new ConfigService())
