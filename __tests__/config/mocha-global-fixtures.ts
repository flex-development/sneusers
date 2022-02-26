import faker from '@faker-js/faker'
import { ENV } from '@sneusers/config/configuration'
import sequelize from '@tests/fixtures/sequelize.fixture'
import umzug from '@tests/fixtures/umzug.fixture'
import initdb from '@tests/utils/initdb.util'
import chai, { expect } from 'chai'
import { spawn } from 'child_process'
import { format } from 'pretty-format'
import sinon from 'sinon'
import { inspect } from 'util'

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
global.inspect = inspect
global.pf = format
global.sandbox = sinon.createSandbox()

/**
 * Prepares the global test environment.
 *
 * This includes:
 *
 * - Starting a PostgreSQL server in non-Docker/CI environments
 * - Running database migrations
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
export const mochaGlobalSetup = async (): Promise<void> => {
  if (ENV.DB_LOCAL) initdb()

  await umzug.up({ migrations: ENV.DB_MIGRATIONS, rerun: 'ALLOW' })
  await sequelize.sync(sequelize.options.sync)
}

/**
 * Cleanups the global test environment.
 *
 * This includes:
 *
 * - Reverting database migrations
 * - Shutting down the PostgreSQL server in non-Docker/CI environments
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
export const mochaGlobalTeardown = async (): Promise<void> => {
  await umzug.down({ migrations: ENV.DB_MIGRATIONS, rerun: 'ALLOW' })

  if (ENV.DB_LOCAL) {
    spawn('pg_ctl', ['stop'], {
      cwd: process.cwd(),
      env: process.env,
      shell: process.env.SHELL
    })
  }
}
