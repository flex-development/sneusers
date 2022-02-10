import type { NullishNumber, NullishString } from '@flex-development/tutils'

/**
 * @file Users Subdomain Interfaces - IUserRaw
 * @module sneusers/subdomains/users/interfaces/IUserRaw
 */

/**
 * Object representing a `User` entity **(from the database)**.
 *
 * **Does not include any [virtual fields][1]**.
 *
 * [1]: https://sequelize.org/v7/manual/getters-setters-virtuals#virtual-fields
 */
interface IUserRaw {
  created_at: number
  display_name: NullishString
  email: Lowercase<string>
  email_verified: boolean
  first_name: NullishString
  id: number
  last_name: NullishString
  password: NullishString
  updated_at: NullishNumber
}

export default IUserRaw
