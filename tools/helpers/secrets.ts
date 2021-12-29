import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import isNodeEnv from '@flex-development/tutils/guards/is-node-env.guard'
import { config as dotenv } from 'dotenv'
import expand from 'dotenv-expand'
import sh from 'shelljs'

/**
 * @file Helpers - secrets
 * @module helpers/secrets
 */

export enum SecretsFormat {
  DOCKER = 'docker',
  ENV = 'env',
  ENV_NO_QUOTES = 'env-no-quotes',
  JSON = 'json',
  YAML = 'yaml'
}

export type SecretsJson = Record<string, string>

export type SecretsOptions = {
  /**
   * Secrets formatting.
   *
   * @default SecretsFormat.JSON
   */
  format?: SecretsFormat

  /**
   * Log secrets after retrieval.
   *
   * @default false
   */
  log?: boolean
}

/**
 * Downloads environment variables from [Doppler][1].
 *
 * [1]: https://docs.doppler.com/docs
 *
 * @see https://docs.doppler.com/reference/download
 *
 * @requires .env.doppler [file]
 * @requires process.env.DOPPLER_TOKEN_DEV
 * @requires process.env.DOPPLER_TOKEN_TEST
 * @requires process.env.DOPPLER_TOKEN_PROD
 *
 * @template R - Function return type
 *
 * @param {SecretsOptions} options - Retrieval options
 * @param {boolean} [options.format=SecretsFormat.JSON] - Secrets formatting
 * @param {boolean} [options.log=false] - Log secrets after retrieval
 * @return {SecretsJson | string} Secrets
 */
function secrets<R extends SecretsJson | string = SecretsJson>({
  format = SecretsFormat.JSON,
  log = false
}: SecretsOptions): R {
  // Load environment variables
  expand(dotenv({ path: `${process.cwd()}/.env.doppler` }))

  /** @property {boolean} json - Check if formatting secrets as json */
  const json: boolean = format === SecretsFormat.JSON

  /** @property {string} DOPPLER_TOKEN - Doppler API token */
  const DOPPLER_TOKEN: string = ((): string => {
    let NODE_ENV = process.env.NODE_ENV as NodeEnv
    NODE_ENV = isNodeEnv(NODE_ENV) ? NODE_ENV : NodeEnv.DEV

    let type: keyof typeof NodeEnv = 'DEV'

    if (NODE_ENV === NodeEnv.TEST) type = 'TEST'
    if (NODE_ENV === NodeEnv.PROD) type = 'PROD'

    return process.env[`DOPPLER_TOKEN_${type}`] || ''
  })()

  /** @property {string} CURL_COMMAND - curl command to retrieve secrets */
  const CURL_COMMAND = ((): string => {
    const accept = json ? 'application/json' : 'text/plain'
    const credentials = Buffer.from(`${DOPPLER_TOKEN}:`).toString('base64')

    return `curl --request GET --url 'https://api.doppler.com/v3/configs/config/secrets/download?format=${format}' --header 'Accept: ${accept}' --header 'Authorization: Basic ${credentials}'`
  })()

  /** @property {string} raw - Raw secrets */
  const raw: string = sh.exec(CURL_COMMAND, { silent: !log }).stdout

  // Parse if json format was requested
  if (json) {
    /** @property {SecretsJson} secrets - Parsed version of {@link raw} */
    const secrets: SecretsJson = JSON.parse(raw || '')

    // Override environment variables
    for (const v of Object.keys(secrets)) process.env[v] = secrets[v]

    log && console.log(secrets)
    return secrets as R
  }

  log && console.log(raw)
  return raw as R
}

export default secrets
