import type JwtPayloadAccess from './jwt-payload-access.dto'
import type JwtPayloadRefresh from './jwt-payload-refresh.dto'
import type JwtPayloadVerif from './jwt-payload-verif.dto'

/**
 * @file Auth Subdomain DTOs - JwtPayload
 * @module sneusers/subdomains/auth/dtos/JwtPayload
 */

/**
 * JWT payload extracted from a decoded access, refresh, or verification token.
 */
type JwtPayload = JwtPayloadAccess | JwtPayloadRefresh | JwtPayloadVerif

export default JwtPayload
