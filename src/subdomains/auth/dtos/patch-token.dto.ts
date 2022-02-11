import type { ITokenRaw } from '../interfaces'

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
