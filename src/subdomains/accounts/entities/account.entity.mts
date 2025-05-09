/**
 * @file Entities - Account
 * @module sneusers/accounts/entities/Account
 */

import Role from '#accounts/enums/role'
import AccountCreatedEvent from '#accounts/events/account-created.event'
import type { AccountDocument } from '@flex-development/sneusers/accounts'
import { Entity, type EntityData } from '@flex-development/sneusers/database'
import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength
} from 'class-validator'

/**
 * User account entity.
 *
 * @class
 * @extends {Entity<AccountDocument>}
 * @implements {AccountDocument}
 */
class Account extends Entity<AccountDocument> implements AccountDocument {
  /**
   * User email address.
   *
   * @public
   * @instance
   * @member {string} email
   */
  @IsEmail()
  public email: string

  /**
   * Hashed password.
   *
   * @public
   * @instance
   * @member {string} password
   */
  @IsString()
  @MinLength(6)
  public password: string

  /**
   * The role of the user.
   *
   * @public
   * @instance
   * @member {Role} role
   */
  @IsEnum(Role)
  public role: Role

  /**
   * Create a new user account.
   *
   * @param {EntityData<AccountDocument>} props
   *  Account entity props
   */
  constructor(props: EntityData<AccountDocument>) {
    super(props)

    this.email = props.email
    this.password = props.password
    this.role = props.role

    // apply new account event.
    !props._id && this.apply(new AccountCreatedEvent(this))
  }
}

export default Account
