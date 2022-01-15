import type { IUserRaw } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Global Test Types - MockAuthedUser
 * @module tests/utils/types/MockAuthedUser
 */

/**
 * Object representing a mock authenticated user.
 */
interface MockAuthedUser {
  access_token: string
  email: IUserRaw['email']
  first_name: IUserRaw['first_name']
  id: IUserRaw['id']
  last_name: IUserRaw['last_name']
  password?: IUserRaw['password']
}

export default MockAuthedUser
