import type {
  NullishNumber,
  NullishString,
  OrNull
} from '@flex-development/tutils'
import type { OAuthProvider } from '@sneusers/subdomains/auth/enums'

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
  provider: OrNull<OAuthProvider>
  updated_at: NullishNumber
}

export default IUserRaw
