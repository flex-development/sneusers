import SQL from '@nearform/sql'
import ch from 'chalk'
import { spawn } from 'child_process'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import sh from 'shelljs'

/**
 * @file Global Test Utilities - initdb
 * @module tests/utils/initdb
 */

/**
 * Sets up a PostgreSQL database.
 *
 * @requires process.env.PGDATA
 * @requires process.env.POSTGRES_DATABASES
 * @requires process.env.PGUSER
 *
 * @see https://postgresql.org/docs/14/app-initdb.html
 * @see https://postgresql.org/docs/14/app-pg-ctl.html
 *
 * @return {boolean} `true` if initialized, `false` if skipped
 * @throws {Error}
 */
const initdb = (): boolean => {
  /**
   * Logs a message to the console with the prefix `initdb:` in bold.
   *
   * @param {any} message - Log message
   * @param {any[]} [params] - Additional log parameters
   * @return {void} Nothing when complete
   */
  const log = (message?: any, ...params: any[]): void => {
    return console.log(`${ch.bold('initdb:')} ${message}`, ...params)
  }

  /** @property {sh.ExecOptions} exec_options - {@link sh.exec} options */
  const exec_options: sh.ExecOptions = {
    cwd: process.cwd(),
    env: process.env,
    fatal: true,
    shell: 'bash',
    silent: false
  }

  // check if database directory is set
  if (!process.env.PGDATA) throw new Error('no database directory specified')

  // get database directory path
  const PGDATA = path.resolve(process.cwd(), process.env.PGDATA)

  // check if initialization is needed
  if (fs.existsSync(path.resolve(PGDATA, 'PG_VERSION'))) {
    log('PostgreSQL database directory appears to contain a database')
    log('Skipping initialization')

    const postmaster = fs.existsSync(path.resolve(PGDATA, 'postmaster.opts'))

    spawn('pg_ctl', [postmaster ? 'restart' : 'start'], exec_options)
    return false
  }

  // clear database directory
  if (fse.existsSync(path.resolve(PGDATA))) fse.emptyDirSync(PGDATA)

  // check if postgres is installed and $PGUSER is set
  if (!sh.which('postgres')) throw new Error('postgres install required')
  if (!process.env.PGUSER) throw new Error('no database user specified')

  // get initdb args and command
  const username = '--username="$PGUSER"'
  const pwfile = process.env.PGPASSWORD ? `--pwfile=<(echo "$PGPASSWORD")` : ''
  let command = ['initdb', username, pwfile].filter(Boolean).join(' ')

  // initialize
  sh.exec(command, exec_options)
  log('PostgreSQL init process complete; ready for start up.')

  // launch new server
  spawn('pg_ctl', ['start'], exec_options)

  // create databases
  if (process.env.POSTGRES_DATABASES) {
    log(`Database creation requested: ${process.env.POSTGRES_DATABASES}`)

    for (const db of process.env.POSTGRES_DATABASES.split(',')) {
      log(`Creating database '${db}'`)

      const database = SQL.unsafe(db)
      const owner = SQL.unsafe(process.env.PGUSER)

      const sql = SQL`
        CREATE DATABASE ${database};
        GRANT ALL PRIVILEGES ON DATABASE ${database} TO ${owner};
      `

      command = `psql -v ON_ERROR_STOP=1 ${username}`
      command += `${command} <<-EOSQL\n\t${sql.text}\nEOSQL`

      sh.exec(command, exec_options)
    }

    log('Created requested databases')
  }

  return true
}

export default initdb
