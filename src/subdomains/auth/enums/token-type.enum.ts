/**
 * @file Auth Subdomain Enums - TokenType
 * @module sneusers/subdomains/auth/enums/TokenType
 */

/**
 * Types of JWTs stored in the database.
 *
 * @enum {Uppercase<string>}
 */
enum TokenType {
  REFRESH = 'REFRESH',
  VERIFICATION = 'VERIFICATION'
}

export default TokenType
