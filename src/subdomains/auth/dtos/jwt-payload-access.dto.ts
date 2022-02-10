import { TokenType } from '@sneusers/subdomains/auth/enums'
import type { ITokenRaw } from '@sneusers/subdomains/auth/interfaces'
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
   * Id of access token entity.
   */
  jti: `${ITokenRaw['id']}`

  /**
   * Id of user who access token was issued to.
   */
  sub: `${IUserRaw['id']}`

  /**
   * Token type.
   */
  type: TokenType.ACCESS
}

export default JwtPayloadAccess
