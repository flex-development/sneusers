/**
 * @file Mocha Configuration - Base
 * @see https://mochajs.org/#command-line-usage
 * @see https://mochajs.org/#configuration-format
 * @see https://typestrong.org/ts-node/docs/recipes/mocha
 */

/** @property {string} PWD - Current working directory */
const PWD = process.cwd()

/** @property {string[]} TYPES - Test file prefixes (e.g: `*spec.ts`) */
const TYPES = ['', 'e2e', 'functional', 'integration']

/** @type {Mocha.MochaInstanceOptions} */
const config = {
  allowUncaught: false,
  asyncOnly: false,
  bail: false,
  checkLeaks: true,
  color: true,
  diff: true,
  exit: true,
  extension: TYPES.map(type => `${type}.spec.ts`),
  failZero: false,
  forbidOnly: true,
  forbidPending: false,
  fullTrace: true,
  globals: ['chai', 'expect', 'pf', 'sandbox'],
  growl: !(require('is-ci') || process.env.GITHUB_ACTIONS === true),
  ignore: ['coverage/**', 'node_modules/**'],
  inlineDiffs: true,
  isWorker: true,
  noHighlighting: false,
  nodeOption: [],
  parallel: true,
  recursive: true,
  reporter: `${PWD}/__tests__/reporters/jsonspec.ts`,
  reporterOptions: [],
  require: [
    'ts-node/register',
    `${PWD}/tools/helpers/tsconfig-paths.cjs`,
    `${PWD}/__tests__/config/mocha-global-fixtures.ts`,
    `${PWD}/__tests__/config/mocha-root-hooks.ts`
  ],
  retries: 0,
  sort: false,
  spec: 'src/{,!(coverage|node_modules)/**}/__tests__/*.spec.ts',
  timeout: 10 * 1000,
  ui: 'bdd',
  watch: false
}

module.exports = config
