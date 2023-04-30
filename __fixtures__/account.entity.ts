/**
 * @file Fixtures - Account
 * @module fixtures/Account
 */

import { IsNullable, IsOptional, IsTimestamp } from '#src/decorators'
import type { IEntity } from '#src/interfaces'
import { isNIL, type Nullable } from '@flex-development/tutils'
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
  type EntityData
} from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'
import { IsEmail, IsInstance, IsLowercase, IsMongoId } from 'class-validator'
import plur from 'plur'

/**
 * Data used to create a new account via the entity constructor.
 */
type AccountDTO = Omit<EntityData<Account>, 'email'> & { email: string }

/**
 * Data model representing an entity in the accounts collection.
 *
 * @class
 * @implements {IEntity}
 */
@Entity({ collection: plur(Account.name).toLowerCase() })
class Account implements IEntity {
  /**
   * BSON object id.
   *
   * @public
   * @readonly
   * @member {ObjectId} _id
   */
  @PrimaryKey<Account>({ type: ObjectId })
  @IsInstance(ObjectId)
  @IsOptional()
  public _id!: ObjectId

  /**
   * Unix timestamp indicating when account was created.
   *
   * @public
   * @readonly
   * @member {number} created_at
   */
  @Property<Account>({ type: 'integer' })
  @IsTimestamp()
  public created_at: number = Date.now()

  /**
   * Account email address.
   *
   * @public
   * @readonly
   * @member {Lowercase<string>} email
   */
  @Property<Account>({ type: 'string' })
  @Unique<Account>({ name: 'email' })
  @IsEmail()
  @IsLowercase()
  public email!: Lowercase<string>

  /**
   * Unique identifier for account.
   *
   * @public
   * @readonly
   * @member {string} id
   */
  @SerializedPrimaryKey<Account>({ type: 'string' })
  @IsMongoId()
  @IsOptional()
  public id!: string

  /**
   * Unix timestamp indicating when account was last modified.
   *
   * @public
   * @readonly
   * @member {Nullable<number>} updated_at
   */
  @Property<Account>({ nullable: true, type: 'integer' })
  @IsTimestamp()
  @IsNullable()
  public updated_at: Nullable<number> = null

  /**
   * Creates a new account entity.
   *
   * @param {AccountDTO} dto - Data transfer object
   * @param {string} dto.email - Account email
   */
  constructor({ _id, created_at, email, updated_at }: AccountDTO) {
    if (!isNIL(_id)) {
      this._id = _id
      this.id = this._id.toString()
    }

    !isNIL(created_at) && (this.created_at = created_at)
    !isNIL(updated_at) && (this.updated_at = updated_at)

    this.email = email.trim().toLowerCase()
  }
}

export default Account
