import NodeEnv from '@flex-development/tutils/enums/node-env.enum'
import sh from 'shelljs'

/**
 * @file Helpers - secrets
 * @module helpers/secrets
 */

export type SecretsJson = Record<string, { computed: string }>

export type SecretsOptions = {
  config?: NodeEnv
  log_raw?: boolean
  log_secrets?: boolean
  log_token?: boolean
}

export type Secrets = Record<string, string>

/**
 * Retrieves environment variables from [Doppler][1].
 *
 * [1]: https://docs.doppler.com/docs
 *
 * @param {SecretsOptions} options - Retrieval options
 * @param {NodeEnv} [options.config=process.env.NODE_ENV] - Secrets config name
 * @param {boolean} [options.log_raw=false] - Log raw secrets data
 * @param {boolean} [options.log_secrets=false] - Log parsed secrets
 * @param {boolean} [options.log_token=false] - Log new token when created
 * @return {Secrets} Object containing environment variables
 */
const secrets = ({
  config = process.env.NODE_ENV as NodeEnv,
  log_secrets = false,
  log_raw = false,
  log_token = false
}: SecretsOptions): Secrets => {
  /** @property {string} token_create - `doppler configs tokens` arguments */
  const token_create: string = [
    `doppler configs tokens create secrets-${config}`,
    `--config=${config}`,
    `--max-age=1h`,
    `--plain`,
    `--no-read-env`
  ].join(' ')

  /** @property {string} secrets_get - `doppler secrets` arguments */
  const secrets_get: string = [
    'doppler secrets',
    `--json`,
    `--config=${config}`,
    `--token=${sh.exec(token_create, { silent: !log_token }).stdout}`
  ].join(' ')

  /** @property {string} secrets- Stringified doppler secrets */
  const secrets_raw = sh.exec(secrets_get, { silent: true }).stdout

  /** @property {SecretsJson} secrets_json - Parsed {@link secrets_raw} */
  const secrets_json: SecretsJson = JSON.parse(secrets_raw)

  /** @property {string} variables - Names of secrets */
  const variables: string[] = Object.keys(secrets_json)

  /** @property {Secrets} secrets - Environment variable object */
  const secrets: Secrets = {}

  // Log raw secrets
  log_raw && console.log(secrets_json)

  // Get environment variables
  for (const variable of variables) {
    let value = secrets_json[variable].computed

    if (value.startsWith('$')) {
      const other = value.slice(1, value.length)
      if (variables.includes(other)) value = secrets_json[other].computed
    }

    secrets[variable] = value
    process.env[variable] = secrets[variable]
  }

  // Log secrets
  log_secrets && console.log(secrets)

  return secrets
}

export default secrets
