import { ConfigService } from '@nestjs/config'
import { VALIDATED_ENV_PROPNAME } from '@nestjs/config/dist/config.constants'
import { ENV } from '@sneusers/config/configuration'
import type Env from '@sneusers/models/environment-variables.model'

/**
 * @file Fixtures - ConfigService
 * @module fixtures/ConfigService
 */

export default new ConfigService<Env, true>({ [VALIDATED_ENV_PROPNAME]: ENV })
