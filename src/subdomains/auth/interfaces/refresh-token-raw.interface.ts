import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Auth Subdomain Interfaces - ITokenRaw
 * @module sneusers/subdomains/auth/interfaces/ITokenRaw
 */

/**
 * Object representing a `RefreshToken` entity **(from the database)**.
 *
 * **Does not include any [virtual fields][1]**.
 *
 * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
 */
interface ITokenRaw {
  expires: number
  id: number
  revoked: boolean
  user: IUserRaw['id']
}

export default ITokenRaw
