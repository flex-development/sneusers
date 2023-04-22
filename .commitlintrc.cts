/**
 * @file Configuration - commitlint
 * @module config/commitlint
 * @see https://commitlint.js.org
 */

import {
  RuleConfigSeverity as Severity,
  type UserConfig
} from '@commitlint/types'
import { max, scopes } from '@flex-development/commitlint-config'

/**
 * Commit scopes.
 *
 * @const {string[]} SCOPE_ENUM
 */
const SCOPE_ENUM: string[] = scopes([
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
  'ssl',
  'users',
  'vm'
])

/**
 * `commitlint` configuration object.
 *
 * @const {UserConfig} config
 */
const config: UserConfig = {
  extends: ['@flex-development'],
  rules: {
    'scope-enum': [Severity.Error, 'always', SCOPE_ENUM],
    'scope-max-length': [Severity.Error, 'always', max(SCOPE_ENUM)]
  }
}

export default config
