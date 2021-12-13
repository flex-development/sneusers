const path = require('path')
const baseConfig = require('./.mocharc.base.cjs')

/**
 * @file Mocha Configuration - Root
 * @see https://mochajs.org/#command-line-usage
 * @see https://mochajs.org/#configuration-format
 */

/** @type {Mocha.MochaInstanceOptions} */
const config = {
  ...baseConfig,
  package: path.join(process.cwd(), 'package.json')
}

module.exports = config
