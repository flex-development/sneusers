import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import type { ITokenRaw } from '../interfaces'

/**
 * @file Auth Subdomain DTOs - CreateTokenDTO
 * @module sneusers/subdomains/auth/dtos/CreateTokenDTO
 */

/**
 * Data used to create a new `Token` instance.
 */
class CreateTokenDTO {
  /** When token was created. */
  readonly created_at?: never

  /** Unique identifier for token */
  readonly id?: never

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
