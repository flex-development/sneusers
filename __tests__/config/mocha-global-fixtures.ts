import sequelize from '@fixtures/sequelize.fixture'
import umzug from '@fixtures/umzug.fixture'
import { ENV } from '@sneusers/config/configuration'
import { SequelizeConfigService } from '@sneusers/modules/db/providers'
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
global.inspect = inspect
global.pf = format
global.sandbox = sinon.createSandbox()

/**
 * Prepares the global test environment.
 *
 * This includes:
 *
 * - Starting a PostgreSQL server in non-Docker/CI environments
 * - Running database migrations and seeders
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
export const mochaGlobalSetup = async (): Promise<void> => {
  if (ENV.DB_LOCAL) initdb()

  sequelize.options.logging = SequelizeConfigService.logging

  await umzug.migrator.up()
  await umzug.seeder.up()
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
  const migrations = (await umzug.migrator.executed()).map(meta => meta.name)
  const seeders = (await umzug.seeder.executed()).map(meta => meta.name)

  await umzug.seeder.down({ migrations: seeders })
  await umzug.migrator.down({ migrations })

  if (ENV.DB_LOCAL) {
    spawn('pg_ctl', ['stop'], {
      cwd: process.cwd(),
      env: process.env,
      shell: process.env.SHELL
    })
  }
}
