const { extensions } = require('./.vscode/settings.json')['eslint.options']

/**
 * @file Lint Staged Configuration
 * @see https://github.com/okonet/lint-staged
 */

module.exports = {
  /**
   * Attempt to fix code style when JavaScript, Markdown, and TypeScript files
   * are changed.
   */
  [`*.{${extensions.map(ext => ext.slice(1)).join()}}`]: [
    'yarn fix:style',
    'git add -A'
  ],

  /**
   * Attempt to fix formatting when **ANY** file is changed.
   */
  '*': ['yarn fix:format', 'git add -A'],

  /**
   * Run type check when TypeScript files are changed.
   *
   * @return {string} Type check command
   */
  '{**/*.ts,**/tsconfig.*}': [() => 'yarn check:types'],

  /**
   * Run local integrity check when dependencies are updated.
   */
  'yarn.lock': ['yarn check:dedupe']
}
