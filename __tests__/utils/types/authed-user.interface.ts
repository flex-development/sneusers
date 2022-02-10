import type { IUser } from '@sneusers/subdomains/users/interfaces'

/**
 * @file Global Test Types - AuthedUser
 * @module tests/utils/types/AuthedUser
 */

/**
 * Object representing an authenticated user.
 *
 * @extends IUser
 */
interface AuthedUser extends IUser {
  readonly access_token: string
  first_name: NonNullable<IUser['first_name']>
  last_name: NonNullable<IUser['last_name']>
  readonly password: NonNullable<IUser['password']>
}

export default AuthedUser
