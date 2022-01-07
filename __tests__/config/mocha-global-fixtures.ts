import chai, { expect } from 'chai'
import faker from 'faker'
import { format } from 'pretty-format'
import sinon from 'sinon'

/**
 * @file Global Test Configuration - Mocha Global Fixtures
 * @module tests/config/mochaGlobalFixtures
 * @see https://mochajs.org/#global-setup-fixtures
 * @see https://mochajs.org/#global-teardown-fixtures
 */

/** Tell TypeScript to use {@link NodeJS.TestingGlobal} type */
declare const global: NodeJS.TestingGlobal

// ! Update global namespace
global.expect = expect
global.chai = chai
global.faker = faker
global.pf = format
global.sandbox = sinon.createSandbox()

/**
 * Prepares the global test environment.
 *
 * @return {void} Nothing when complete
 */
export const mochaGlobalSetup = (): void => {
  return
}

/**
 * Cleanups the global test environment.
 *
 * @return {void} Nothing when complete
 */
export const mochaGlobalTeardown = (): void => {
  return
}
