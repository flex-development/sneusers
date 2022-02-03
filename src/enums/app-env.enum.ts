/**
 * @file Enums - AppEnv
 * @module sneusers/enums/AppEnv
 */

/**
 * Names of application environments.
 *
 * @enum {Lowercase<string>}
 */
enum AppEnv {
  DEV = 'development',
  PROD = 'production',
  STG = 'staging',
  TEST = 'test'
}

export default AppEnv
