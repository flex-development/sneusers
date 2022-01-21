import type JwtPayloadAccess from './jwt-payload-access.dto'
import type JwtPayloadToken from './jwt-payload-token.dto'

/**
 * @file Auth Subdomain DTOs - JwtPayload
 * @module sneusers/subdomains/auth/dtos/JwtPayload
 */

/**
 * JWT payload extracted from a decoded access, refresh, or verification token.
 */
type JwtPayload = JwtPayloadAccess | JwtPayloadToken

export default JwtPayload
