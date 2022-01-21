import type { ITokenRaw } from '@sneusers/subdomains/auth/interfaces'

/**
 * @file Auth Subdomain DTOs - PatchTokenDTO
 * @module sneusers/subdomains/auth/dtos/PatchTokenDTO
 */

/**
 * Data used to update an existing `Token` instance.
 */
class PatchTokenDTO {
  /**
   * Mark token as enabled or revoked.
   */
  revoked?: ITokenRaw['revoked']
}

export default PatchTokenDTO
