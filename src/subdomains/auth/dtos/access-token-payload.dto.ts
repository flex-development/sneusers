import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Auth Subdomain DTOs - AccessTokenPayload
 * @module sneusers/subdomains/auth/dtos/AccessTokenPayload
 */

/**
 * JWT payload extracted from a decoded access token.
 */
export default class AccessTokenPayload {
  /**
   * Id of user who access token was issued to.
   */
  sub: IUserRaw['id']
}
