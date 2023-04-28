/**
 * @file Data Transfer Objects - UserDTO
 * @module sneusers/subdomains/users/dtos/User
 */

import type { IUser } from '#src/subdomains/users/interfaces'

/**
 * Object representing user entity constructor data.
 *
 * @extends {Omit<Partial<IUser>,'email'>}
 */
interface UserDTO extends Omit<Partial<IUser>, 'email'> {
  /**
   * User email address.
   */
  email?: string
}

export type { UserDTO as default }
