import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { TokenType } from '../enums'
import type { ITokenRaw } from '../interfaces'

/**
 * @file Auth Subdomain DTOs - JwtPayloadVerif
 * @module sneusers/subdomains/auth/dtos/JwtPayloadVerif
 */

/**
 * JWT payload extracted from a decoded verification token.
 */
class JwtPayloadVerif {
  /**
   * Id of verification token entity.
   */
  jti: `${ITokenRaw['id']}`

  /**
   * Email of user who verification token was issued to.
   */
  sub: IUserRaw['email']

  /**
   * Token type.
   */
  type: TokenType.VERIFICATION
}

export default JwtPayloadVerif
