import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Global Test Fixture - ConfigService
 * @module tests/fixtures/ConfigService
 */

export default new ConfigService<EnvironmentVariables, true>()
