import { ConfigService } from '@nestjs/config'
import { VALIDATED_ENV_PROPNAME } from '@nestjs/config/dist/config.constants'
import { ENV } from '@sneusers/config/configuration'
import type { EnvironmentVariables } from '@sneusers/models'

/**
 * @file Fixtures - ConfigService
 * @module fixtures/ConfigService
 */

export default new ConfigService<EnvironmentVariables, true>({
  [VALIDATED_ENV_PROPNAME]: ENV
})
