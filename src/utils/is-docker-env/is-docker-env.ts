import sh from 'shelljs'

/**
 * @file Utilities - isDockerEnv
 * @module sneusers/utils/isDockerEnv/impl
 */

/**
 * Checks if the Docker `app` service is running.
 *
 * @return {boolean} `true` if reachable, `false` otherwise
 */
const isDockerEnv = (): boolean => {
  const app = sh.exec('docker ps --filter name=app --format {{.Names}}', {
    cwd: process.cwd(),
    env: process.env,
    fatal: false,
    shell: process.env.SHELL,
    silent: true
  })

  return app.toString().trim() === 'app'
}

export default isDockerEnv
