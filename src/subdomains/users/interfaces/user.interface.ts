/**
 * @file Interfaces - IUser
 * @module sneusers/subdomains/users/interfaces/IUser
 */

import type { IEntity } from '#src/interfaces'
import type { Nullable } from '@flex-development/tutils'

/**
 * Object representing a user entity.
 *
 * @extends {IEntity}
 */
interface IUser extends IEntity {
  /**
   * User display name.
   */
  display_name: Nullable<string>

  /**
   * User email address.
   */
  email: Lowercase<string>
}

export type { IUser as default }
