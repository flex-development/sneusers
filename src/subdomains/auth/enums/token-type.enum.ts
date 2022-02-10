/**
 * @file Auth Subdomain Enums - TokenType
 * @module sneusers/subdomains/auth/enums/TokenType
 */

/**
 * Types of JWTs issued.
 *
 * @enum {Uppercase<string>}
 */
enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  VERIFICATION = 'VERIFICATION'
}

export default TokenType
