import type JwtPayloadRefresh from './jwt-payload-refresh.dto'
import type JwtPayloadVerif from './jwt-payload-verif.dto'

/**
 * @file Auth Subdomain DTOs - JwtPayloadToken
 * @module sneusers/subdomains/auth/dtos/JwtPayloadToken
 */

/**
 * JWT payload extracted from tokens that are also persisted in the database.
 */
type JwtPayloadToken = JwtPayloadRefresh | JwtPayloadVerif

export default JwtPayloadToken
