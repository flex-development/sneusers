import { OrNull } from '@flex-development/tutils'
import { ApiProperty } from '@nestjs/swagger'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { Exception } from '@sneusers/exceptions'
import { Entity } from '@sneusers/modules/db/entities'
import {
  DatabaseSequence,
  DatabaseTable,
  OrderDirection,
  SequelizeError
} from '@sneusers/modules/db/enums'
import type { SequelizeErrorType } from '@sneusers/modules/db/types'
import { SearchOptions } from '@sneusers/modules/db/types'
import { Token } from '@sneusers/subdomains/auth/entities'
import { OAuthProvider, TokenType } from '@sneusers/subdomains/auth/enums'
import { trimmedLowercasedFields } from '@sneusers/utils'
import {
  Column,
  DataType,
  HasMany,
  Index,
  Sequelize,
  Table
} from 'sequelize-typescript'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { CreateUserDTO } from '../dtos'
import { IUser, IUserRaw } from '../interfaces'
import { UserUid } from '../types'

/**
 * @file Users Subdomain Entities - User
 * @module sneusers/subdomains/users/entities/User
 */

/**
 * [Data access object][1] for the {@link DatabaseTable.USERS} table.
 *
 * [1]: https://en.wikipedia.org/wiki/Data_access_object
 *
 * @extends {Entity<IUserRaw, CreateUserDTO, IUser>}
 * @implements {IUser}
 */
@Table<User>({
  defaultScope: {
    attributes: User.KEYS,
    order: [['id', OrderDirection.ASC]],
    raw: false
  },
  deletedAt: false,
  hooks: {
    /**
     * Normalizes data before a user is persisted to the database.
     *
     * This includes:
     *
     * - Trimming string fields and forcing those fields to be lowercased
     * - Setting defaults for users registered with an {@link OAuthProvider}
     *
     * @param {User} instance - Current user instance
     * @return {void} Nothing when complete
     */
    beforeSave(instance: User): void {
      trimmedLowercasedFields(instance.dataValues)

      if (User.AUTH_PROVIDERS.includes(instance.provider!)) {
        instance.email_verified = true
        instance.password = null
      }
    }
  },
  omitNull: false,
  paranoid: false,
  tableName: DatabaseTable.USERS,
  timestamps: true
})
class User extends Entity<IUserRaw, CreateUserDTO, IUser> implements IUser {
  @ApiProperty({ description: 'When user was created', type: Number })
  @Index('created_at')
  @Column({
    allowNull: false,
    defaultValue: User.CURRENT_TIMESTAMP,
    type: DataType.BIGINT,
    validate: { isUnixTimestamp: User.isUnixTimestamp }
  })
  declare created_at: IUser['created_at']

  @ApiProperty({
    description: 'Display name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @Index('display_name')
  @Column({
    allowNull: true,
    defaultValue: null,
    type: DataType.STRING,
    validate: { notEmpty: true }
  })
  declare display_name: IUser['display_name']

  @ApiProperty({
    description: 'Email address',
    maxLength: 254,
    minLength: 3,
    type: String
  })
  @Column({
    allowNull: false,
    type: DataType.STRING(254),
    unique: true,
    validate: { isEmail: true, len: [3, 254] }
  })
  declare email: IUser['email']

  @ApiProperty({ description: 'Email address verified?', type: Boolean })
  @Index('email_verified')
  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN
  })
  declare email_verified: IUser['email_verified']

  @ApiProperty({
    description: 'First name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @Index('first_name')
  @Column({
    allowNull: true,
    defaultValue: null,
    type: DataType.STRING,
    validate: { notEmpty: true }
  })
  declare first_name: IUser['first_name']

  @ApiProperty({ description: 'Unique identifier', type: Number })
  @Column({
    allowNull: false,
    autoIncrementIdentity: true,
    defaultValue: Sequelize.fn('nextval', DatabaseSequence.USERS),
    primaryKey: true,
    type: 'NUMERIC',
    unique: true,
    validate: { notNull: true }
  })
  declare id: IUser['id']

  @ApiProperty({
    description: 'Last name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @Index('last_name')
  @Column({
    allowNull: true,
    defaultValue: null,
    type: DataType.STRING,
    validate: { notEmpty: true }
  })
  declare last_name: IUser['last_name']

  @ApiProperty({
    description: 'Hashed password',
    nullable: true,
    type: String
  })
  @Column({
    allowNull: true,
    defaultValue: null,
    type: DataType.STRING,
    validate: { isStrong: User.checkPasswordStrength }
  })
  declare password: IUser['password']

  @ApiProperty({
    description: 'Authentication provider',
    enum: OAuthProvider,
    enumName: 'OAuthProvider',
    nullable: true
  })
  @Index('provider')
  @Column({
    allowNull: true,
    defaultValue: null,
    type: DataType.ENUM(...User.AUTH_PROVIDERS)
  })
  declare provider: IUser['provider']

  @HasMany(() => Token)
  declare tokens: Token[]

  @ApiProperty({
    default: null,
    description: 'When user was last modified',
    nullable: true,
    type: Number
  })
  @Index('updated_at')
  @Column({
    allowNull: true,
    defaultValue: null,
    type: DataType.BIGINT,
    validate: { isUnixTimestampOrNull: User.isUnixTimestampOrNull }
  })
  declare updated_at: IUser['updated_at']

  /**
   * Returns the user's full name.
   *
   * @return {IUser['full_name']} User's full name or `null`
   */
  @ApiProperty({ description: 'Full name (virtual property)' })
  @Column(DataType.VIRTUAL(DataType.STRING, ['first_name', 'last_name']))
  get full_name(): IUser['full_name'] {
    if (this.first_name === null && this.last_name === null) return null
    return `${this.first_name || ''} ${this.last_name || ''}`.trim()
  }

  /**
   * @static
   * @readonly
   * @property {ReadonlyArray<OAuthProvider>} AUTH_PROVIDERS - Auth providers
   */
  static readonly AUTH_PROVIDERS: ReadonlyArray<OAuthProvider> = Object.freeze([
    ...Object.values(OAuthProvider)
  ])

  /**
   * @static
   * @readonly
   * @property {(keyof IUserRaw)[]} KEYS_RAW - {@link IUserRaw} attributes
   */
  static readonly KEYS_RAW: (keyof IUserRaw)[] = [
    'created_at',
    'display_name',
    'email',
    'email_verified',
    'first_name',
    'id',
    'last_name',
    'password',
    'provider',
    'updated_at'
  ]

  /**
   * @static
   * @readonly
   * @property {(keyof IUser)[]} KEYS - {@link IUser} attributes
   */
  static readonly KEYS: (keyof IUser)[] = [...User.KEYS_RAW, 'full_name']

  /**
   * Checks a user's password strength.
   *
   * If `password === null`, however, it'll be returned.
   *
   * @static
   * @param {any} password - Password to check
   * @return {User['password']} Password if strength check passes
   * @throws {Error | TypeError}
   */
  static checkPasswordStrength(password: any): User['password'] {
    if (password === null) return password

    if (typeof password !== 'string') {
      throw new TypeError('Password must be a string')
    }

    const strong = isStrongPassword(password, {
      minLength: 8,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 0
    })

    if (strong) return password
    throw new Error('Must be at least 8 characters')
  }

  /**
   * Check if two users are equivalent.
   *
   * @static
   * @param {Partial<Pick<IUser, 'email' | 'id'>>} [user1] - First user
   * @param {Partial<Pick<IUser, 'email' | 'id'>>} [user2] - User to compare
   * @return {boolean} `true` if id and email match, `false` otherwise
   */
  static equal(
    user1?: Partial<Pick<IUser, 'email' | 'id'>>,
    user2?: Partial<Pick<IUser, 'email' | 'id'>>
  ): boolean {
    return (
      user1!.email?.toLowerCase() === user2!.email?.toLowerCase() ||
      user1!.id === user2!.id
    )
  }

  /**
   * Retrieve a user by {@link User#email} address.
   *
   * If a user isn't found, `null` will be returned. To force the function to
   * throw an {@link Exception} instead, set `options.rejectOnEmpty=true`.
   *
   * @see {@link SearchOptions}
   *
   * @static
   * @async
   * @param {IUser['email']} email - Email address of user to find
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<OrNull<User>>} `User` instance or `null`
   * @throws {Exception}
   */
  static async findByEmail(
    email: IUser['email'],
    options: SearchOptions<User> = {}
  ): Promise<OrNull<User>> {
    const find_options: SearchOptions<User> = {
      ...options,
      where: {
        ...(options.where && {}),
        email: this.sequelize.fn('lower', email)
      }
    }

    try {
      return await this.findOne<User>(find_options)
    } catch (e) {
      const error = e as SequelizeErrorType
      const data: ExceptionDataDTO<SequelizeErrorType> = {
        email,
        options: find_options
      }

      if (error.name === SequelizeError.EmptyResult) {
        data.message = `User with email [${email}] not found`
      }

      throw Exception.fromSequelizeError(error, data)
    }
  }

  /**
   * Retrieve a user by {@link User#id} or {@link User#email}.
   *
   * If a user isn't found, `null` will be returned. To force the function to
   * throw an {@link Exception} instead, set `options.rejectOnEmpty=true`.
   *
   * @see {@link SearchOptions}
   *
   * @static
   * @async
   * @param {UserUid} uid - Id or email address of user to find
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<OrNull<User>>} `User` instance or `null`
   * @throws {Exception}
   */
  static async findByUid(
    uid: UserUid,
    options: SearchOptions<User> = {}
  ): Promise<OrNull<User>> {
    if (!isEmail(uid.toString())) return this.findByPk(uid, options)
    return this.findByEmail(uid as string, options)
  }

  /**
   * Retrieves a user's most recently issued access token.
   *
   * @return {OrNull<Token>} Most recently issued token or `null`
   */
  get access_token(): OrNull<Token> {
    if (this.tokens.length === 0) return null

    const tokens = this.tokens.filter(token => token.type === TokenType.ACCESS)

    return tokens.sort((t1, t2) => t2.created_at - t1.created_at)[0] || null
  }
}

export default User
