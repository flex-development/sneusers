/**
 * @file Auth Subdomain Enums - AuthStrategy
 * @module sneusers/subdomains/auth/enums/AuthStrategy
 */

/**
 * Types of authentication strategies.
 *
 * @enum {Lowercase<string>}
 */
enum AuthStrategy {
  GITHUB = 'github',
  GOOGLE = 'google',
  JWT = 'jwt-auth',
  JWT_REFRESH = 'jwt-refresh',
  LOCAL = 'local'
}

export default AuthStrategy
