import type { IRefreshTokenRaw } from '@sneusers/subdomains/auth/interfaces'
import AccessTokenPayload from './access-token-payload.dto'

/**
 * @file Auth Subdomain DTOs - RefreshTokenPayload
 * @module sneusers/subdomains/auth/dtos/RefreshTokenPayload
 */

/**
 * JWT payload extracted from a decoded refresh token.
 *
 * @extends {AccessTokenPayload}
 */
export default class RefreshTokenPayload extends AccessTokenPayload {
  /**
   * Id of refresh token entity.
   */
  jti: IRefreshTokenRaw['id']
}
