import type { UserConfig } from '@commitlint/types'

/**
 * @file Commitlint Configuration
 * @see https://commitlint.js.org/#/guides-local-setup
 * @see https://commitlint.js.org/#/reference-configuration
 */

const config: UserConfig = {
  /**
   * Enable default ignore rules.
   */
  defaultIgnores: true,

  /**
   * IDs of commitlint configurations to extend.
   */
  extends: ['@commitlint/config-conventional'],

  /**
   * Name of formatter package.
   */
  formatter: '@commitlint/format',

  /**
   * Functions that return true if commitlint should ignore the given message.
   */
  ignores: [],

  /**
   * Rules to test commits against.
   *
   * @see https://commitlint.js.org/#/reference-rules
   */
  rules: {
    /**
     * Scope casing.
     */
    'scope-case': [2, 'always', ['kebab-case', 'lower-case']],

    /**
     * Commit scopes.
     */
    'scope-enum': [
      2,
      'always',
      [
        'config',
        'db',
        'deploy',
        'deps',
        'deps-dev',
        'deps-opt',
        'deps-peer',
        'docker',
        'dtos',
        'enums',
        'env',
        'filters',
        'github',
        'guards',
        'interceptors',
        'interfaces',
        'middleware',
        'models',
        'modules',
        'pipes',
        'release',
        'scripts',
        'subdomains',
        'tests',
        'tools',
        'types',
        'typescript',
        'utils',
        'vscode',
        'workflows',
        'yarn'
      ]
    ],

    /**
     * Commit message subject casing.
     */
    'subject-case': [1, 'always', 'lower-case'],

    /**
     * Rules for valid commit types.
     */
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  }
}

export default config
