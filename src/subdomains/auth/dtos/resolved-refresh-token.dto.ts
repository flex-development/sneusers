import { RefreshToken } from '@sneusers/subdomains/auth/entities'
import { User } from '@sneusers/subdomains/users/entities'

/**
 * @file Auth Subdomain DTOs - ResolvedRefreshToken
 * @module sneusers/subdomains/auth/dtos/ResolvedRefreshToken
 */

/**
 * Data extracted from a refresh token.
 */
export default class ResolvedRefreshToken {
  /**
   * Assigned {@link RefreshToken} instance.
   */
  token: RefreshToken

  /**
   * Token owner.
   *
   * @see {@link User}
   */
  user: User
}
