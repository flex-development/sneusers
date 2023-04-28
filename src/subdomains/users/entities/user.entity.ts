/**
 * @file Entities - User
 * @module sneusers/subdomains/users/entities/User
 */

import { DatabaseCollection } from '#src/enums'
import type { UserDTO } from '#src/subdomains/users/dtos'
import type { IUser } from '#src/subdomains/users/interfaces'
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique
} from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'
import { ApiProperty } from '@nestjs/swagger'
import now from '@stdlib/time-now'

/**
 * Data model representing an entity in the users collection.
 *
 * @see {@linkcode DatabaseCollection.USERS}
 *
 * @class
 * @implements {IUser}
 */
@Entity({ collection: DatabaseCollection.USERS })
class User implements IUser {
  /**
   * BSON object id.
   *
   * @public
   * @readonly
   * @member {IUser['_id']} _id
   */
  @PrimaryKey<User>({ type: ObjectId })
  @Unique<IUser>({ name: '_id' })
  public readonly _id!: IUser['_id']

  /**
   * Unix timestamp indicating when user was created.
   *
   * @public
   * @readonly
   * @member {IUser['created_at']} created_at
   */
  @ApiProperty({
    description: 'Unix timestamp indicating when user was created',
    example: 1682456401442,
    format: 'int32',
    type: 'integer'
  })
  @Property<User>({ default: Date.now(), onCreate: now })
  public readonly created_at: IUser['created_at']

  /**
   * User display name.
   *
   * @public
   * @readonly
   * @member {IUser['display_name']} display_name
   */
  @ApiProperty({
    description: 'User display name',
    example: 'Rashawn',
    nullable: true,
    type: 'string'
  })
  @Property<User>({ nullable: true })
  @Index<IUser>({ name: 'display_name' })
  public readonly display_name: IUser['display_name']

  /**
   * User email address.
   *
   * @public
   * @readonly
   * @member {IUser['email']} email
   */
  @ApiProperty({
    description: 'User email address',
    format: 'email',
    type: 'string'
  })
  @Property<User>()
  @Unique<IUser>({ name: 'email' })
  public readonly email: IUser['email']

  /**
   * Unique identifier for user.
   *
   * @public
   * @readonly
   * @member {string} id
   */
  @ApiProperty({
    description: 'Unique identifier for user',
    example: '64471ed6a209d3a19231144a',
    type: 'string'
  })
  @SerializedPrimaryKey<User>()
  public readonly id!: string

  /**
   * Unix timestamp indicating when user was last modified.
   *
   * @public
   * @readonly
   * @member {IUser['updated_at']} updated_at
   */
  @ApiProperty({
    description: 'Unix timestamp indicating when user was last modified',
    example: 1682456525605,
    format: 'int32',
    nullable: true,
    type: 'integer'
  })
  @Property<User>({ default: null, nullable: true, onUpdate: now })
  public readonly updated_at: IUser['updated_at']

  /**
   * Creates a new user entity.
   *
   * @param {UserDTO} dto - User entity data
   */
  constructor({
    _id,
    created_at = Date.now(),
    display_name = null,
    email = '',
    updated_at = null
  }: UserDTO) {
    if (_id) {
      this._id = _id
      this.id = this._id.toString()
    }

    this.created_at = created_at
    this.display_name = display_name
    this.email = email.toLowerCase()
    this.updated_at = updated_at
  }
}

export default User
