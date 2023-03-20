/**
 * @file Configuration - commitlint
 * @module config/commitlint
 * @see https://commitlint.js.org
 */

import {
  RuleConfigSeverity as Severity,
  type UserConfig
} from '@commitlint/types'
import { scopes } from '@flex-development/commitlint-config'

/**
 * `commitlint` configuration object.
 *
 * @const {UserConfig} config
 */
const config: UserConfig = {
  extends: ['@flex-development'],
  rules: {
    'scope-enum': [
      Severity.Error,
      'always',
      scopes([
        'app',
        'auth',
        'cache',
        'db',
        'docker',
        'docker-compose',
        'dockerfile',
        'env',
        'gcp',
        'nestjs',
        'nginx',
        'users',
        'ssl',
        'vm'
      ])
    ]
  }
}

export default config
