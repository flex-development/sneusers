import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import type { TokenType } from '../enums'

/**
 * @file Auth Subdomain Interfaces - ITokenRaw
 * @module sneusers/subdomains/auth/interfaces/ITokenRaw
 */

/**
 * Object representing an `ITokenRaw` entity **(from the database)**.
 *
 * **Does not include any [virtual fields][1]**.
 *
 * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
 */
interface ITokenRaw {
  created_at: number
  id: number
  revoked: boolean
  ttl: number
  type: TokenType
  user: IUserRaw['id']
}

export default ITokenRaw
