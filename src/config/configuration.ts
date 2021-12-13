import type { NumberString } from '@flex-development/tutils'
import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import isNodeEnv from '@flex-development/tutils/guards/is-node-env.guard'
import { EnvironmentVariables as EnvVars } from '@sneusers/models'

/**
 * @file Configuration - Environment Variables
 * @module sneusers/config/configuration
 * @see https://docs.nestjs.com/techniques/configuration
 */

/**
 * Returns an object containing the application's environment variables.
 *
 * @param {NodeEnv} [env] - Stub Node environment
 * @param {NumberString} [port] - Stub port to run application on
 * @return {EnvVars} Object containing **validated** environment variables
 */
const configuration = (env?: NodeEnv, port?: NumberString): EnvVars => {
  // Get Node environment
  let NODE_ENV = (env || process.env.NODE_ENV) as NodeEnv
  NODE_ENV = isNodeEnv(NODE_ENV) ? NODE_ENV : NodeEnv.DEV

  // Load environment variables
  const {
    DESCRIPTION = '',
    HOST,
    HOSTNAME,
    PORT,
    TITLE,
    VERSION = ''
  } = process.env

  // Check if running in production and get protocol
  const PROD = NODE_ENV === NodeEnv.PROD
  const PROTOCOL = `http${!PROD || HOSTNAME === 'localhost' ? '' : 's'}`

  return {
    DESCRIPTION,
    DEV: NODE_ENV === NodeEnv.DEV,
    HOST: HOST || `${PROTOCOL}://${HOSTNAME}:${PORT}`,
    HOSTNAME: HOSTNAME as string,
    NODE_ENV,
    PORT: Number.parseInt(((port || PORT) as string).toString()),
    PROD,
    PROTOCOL,
    TEST: NODE_ENV === NodeEnv.TEST,
    TITLE: TITLE as string,
    VERSION
  }
}

/** @property {EnvVars} CONF - Validated environment variables */
export const CONF: EnvVars = configuration()

/** @property {string[]} ENV_FILE_PATH - Custom environment files */
export const ENV_FILE_PATH = [CONF.NODE_ENV].flatMap((e: NodeEnv) => [
  `${process.cwd()}/.env.${e}.local`,
  `${process.cwd()}/.env.${e}`,
  `${process.cwd()}/.env.defaults`
])

export default configuration
