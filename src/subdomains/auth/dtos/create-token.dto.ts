import type { ITokenRaw } from '@sneusers/subdomains/auth/interfaces'
import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Auth Subdomain DTOs - CreateTokenDTO
 * @module sneusers/subdomains/auth/dtos/CreateTokenDTO
 */

/**
 * Data used to create a new `Token` instance.
 */
class CreateTokenDTO {
  /**
   * Revoke token when created.
   *
   * @default false
   */
  revoked?: ITokenRaw['revoked']

  /**
   * Time to live (in seconds).
   *
   * @default 86400
   */
  ttl?: ITokenRaw['ttl']

  /**
   * Token type.
   */
  type: ITokenRaw['type']

  /**
   * Token owner.
   */
  user: IUserRaw['id']
}

export default CreateTokenDTO
