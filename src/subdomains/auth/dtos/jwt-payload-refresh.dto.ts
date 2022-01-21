import { TokenType } from '@sneusers/subdomains/auth/enums'
import type { ITokenRaw } from '@sneusers/subdomains/auth/interfaces'
import JwtPayloadAccess from './jwt-payload-access.dto'

/**
 * @file Auth Subdomain DTOs - JwtPayloadRefresh
 * @module sneusers/subdomains/auth/dtos/JwtPayloadRefresh
 */

/**
 * JWT payload extracted from a decoded refresh token.
 *
 * @extends JwtPayloadAccess
 */
class JwtPayloadRefresh extends JwtPayloadAccess {
  /**
   * Id of refresh token entity.
   */
  jti: `${ITokenRaw['id']}`

  /**
   * Token type.
   */
  type: TokenType.REFRESH
}

export default JwtPayloadRefresh
