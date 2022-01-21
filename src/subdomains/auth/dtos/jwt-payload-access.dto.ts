import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Auth Subdomain DTOs - JwtPayloadAccess
 * @module sneusers/subdomains/auth/dtos/JwtPayloadAccess
 */

/**
 * JWT payload extracted from a decoded access token.
 */
class JwtPayloadAccess {
  /**
   * Id of user who access token was issued to.
   */
  sub: `${IUserRaw['id']}`
}

export default JwtPayloadAccess
