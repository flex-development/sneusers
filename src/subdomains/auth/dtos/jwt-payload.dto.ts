import type AccessTokenPayload from './access-token-payload.dto'
import type RefreshTokenPayload from './refresh-token-payload.dto'

/**
 * @file Auth Subdomain DTOs - JwtPayload
 * @module sneusers/subdomains/auth/dtos/JwtPayload
 */

/**
 * JWT payload extracted from a decoded access or refresh token.
 */
type JwtPayload = AccessTokenPayload | RefreshTokenPayload

export default JwtPayload
