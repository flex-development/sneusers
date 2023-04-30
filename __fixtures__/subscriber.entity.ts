/**
 * @file Fixtures - Subscriber
 * @module fixtures/Subscriber
 */

import { IsNullable, IsOptional, IsTimestamp } from '#src/decorators'
import type { IEntity } from '#src/interfaces'
import { isNIL, type Nullable } from '@flex-development/tutils'
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
  type EntityData
} from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'
import {
  IsEmail,
  IsInstance,
  IsLowercase,
  IsMongoId,
  IsString,
  MinLength
} from 'class-validator'
import plur from 'plur'

/**
 * Data used to create a new subscriber via the entity constructor.
 */
type SubscriberDTO = Omit<EntityData<Subscriber>, 'email' | 'name'> & {
  email: string
  name: string
}

/**
 * Data model representing an entity in the subscribers collection.
 *
 * @class
 * @implements {IEntity}
 */
@Entity({ collection: plur(Subscriber.name).toLowerCase() })
class Subscriber implements IEntity {
  /**
   * BSON object id.
   *
   * @public
   * @readonly
   * @member {ObjectId} _id
   */
  @PrimaryKey<Subscriber>({ type: ObjectId })
  @IsInstance(ObjectId)
  @IsOptional()
  public _id!: ObjectId

  /**
   * Unix timestamp indicating when subscriber signed up.
   *
   * @public
   * @readonly
   * @member {number} created_at
   */
  @Property<Subscriber>({ type: 'integer' })
  @IsTimestamp()
  public created_at: number = Date.now()

  /**
   * Subscriber email address.
   *
   * @public
   * @readonly
   * @member {Lowercase<string>} email
   */
  @Property<Subscriber>({ type: 'string' })
  @Unique<Subscriber>({ name: 'email' })
  @IsEmail()
  @IsLowercase()
  public email!: Lowercase<string>

  /**
   * Unique identifier for subscriber.
   *
   * @public
   * @readonly
   * @member {string} id
   */
  @SerializedPrimaryKey<Subscriber>({ type: 'string' })
  @IsMongoId()
  @IsOptional()
  public id!: string

  /**
   * Subscriber name.
   *
   * @public
   * @readonly
   * @member {string} name
   */
  @Property<Subscriber>({ type: 'string' })
  @Index<Subscriber>({ name: 'name' })
  @IsString()
  @MinLength(1)
  public name!: string

  /**
   * Unix timestamp indicating when subscriber was last modified.
   *
   * @public
   * @readonly
   * @member {Nullable<number>} updated_at
   */
  @Property<Subscriber>({ nullable: true, type: 'integer' })
  @IsTimestamp()
  @IsNullable()
  public updated_at: Nullable<number> = null

  /**
   * Creates a new subscriber entity.
   *
   * @param {SubscriberDTO} dto - Data transfer object
   * @param {string} dto.email - Subscriber email
   * @param {string} dto.name - Subscriber name
   */
  constructor({ _id, created_at, name, email, updated_at }: SubscriberDTO) {
    if (!isNIL(_id)) {
      this._id = _id
      this.id = this._id.toString()
    }

    !isNIL(created_at) && (this.created_at = created_at)
    !isNIL(updated_at) && (this.updated_at = updated_at)

    this.email = email.trim().toLowerCase()
    this.name = name.trim()
  }
}

export default Subscriber
