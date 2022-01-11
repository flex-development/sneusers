import { JwtService } from '@nestjs/jwt'
import JwtConfigService from './jwt-config-service.fixture'

/**
 * @file Global Test Fixture - JwtConfigService
 * @module tests/fixtures/JwtConfigService
 */

export default new JwtService(JwtConfigService.createJwtOptions())
