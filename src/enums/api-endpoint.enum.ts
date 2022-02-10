/**
 * @file Enums - ApiEndpoint
 * @module sneusers/enums/ApiEndpoint
 */

/**
 * Names of top-level application endpoints.
 *
 * @enum {Lowercase<string>}
 */
enum ApiEndpoint {
  AUTH = 'auth',
  DOCS = 'docs',
  HEALTH = 'health',
  USERS = 'users',
  VERIFY = 'verify'
}

export default ApiEndpoint
