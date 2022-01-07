import type { NullishString } from '@flex-development/tutils'

/**
 * @file Users Subdomain Interfaces - IUserRaw
 * @module sneusers/subdomains/users/interfaces/IUserRaw
 */

/**
 * Object representing a `User` entity **(from a database table)**.
 *
 * **Does not include any [virtual fields][1]**.
 *
 * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
 */
interface IUserRaw {
  created_at: string
  email: string
  first_name: string
  id: number
  last_name: string
  updated_at: NullishString
}

export default IUserRaw
