import type { Token } from '@sneusers/subdomains/auth/entities'
import type { User } from '@sneusers/subdomains/users/entities'

/**
 * @file Auth Subdomain DTOs - ResolvedToken
 * @module sneusers/subdomains/auth/dtos/ResolvedToken
 */

/**
 * Data extracted from a long-lived token.
 */
class ResolvedToken {
  /**
   * Assigned {@link Token} instance.
   */
  token: Token

  /**
   * Token owner.
   *
   * @see {@link User}
   */
  user: User
}

export default ResolvedToken
