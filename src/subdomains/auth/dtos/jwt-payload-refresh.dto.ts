import { TokenType } from '@sneusers/subdomains/auth/enums'
import type { ITokenRaw } from '@sneusers/subdomains/auth/interfaces'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Auth Subdomain DTOs - JwtPayloadRefresh
 * @module sneusers/subdomains/auth/dtos/JwtPayloadRefresh
 */

/**
 * JWT payload extracted from a decoded refresh token.
 */
class JwtPayloadRefresh {
  /**
   * Id of refresh token entity.
   */
  jti: `${ITokenRaw['id']}`

  /**
   * Id of user who refresh token was issued to.
   */
  sub: `${IUserRaw['id']}`

  /**
   * Token type.
   */
  type: TokenType.REFRESH
}

export default JwtPayloadRefresh
