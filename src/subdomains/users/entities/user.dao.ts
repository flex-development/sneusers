import { NullishString, OrNull } from '@flex-development/tutils'
import { ApiProperty } from '@nestjs/swagger'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { BaseEntity } from '@sneusers/entities'
import { DatabaseTable, SequelizeErrorName } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { Token } from '@sneusers/subdomains/auth/entities'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { IUser, IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UserUid } from '@sneusers/subdomains/users/types'
import type { SequelizeError } from '@sneusers/types'
import { SearchOptions } from '@sneusers/types'
import {
  AllowNull,
  Column,
  Comment,
  DataType,
  Default,
  HasMany,
  Index,
  Table,
  Unique,
  Validate
} from 'sequelize-typescript'
import type { Literal } from 'sequelize/types/lib/utils'
import isDate from 'validator/lib/isDate'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'

/**
 * @file Users Subdomain Entities - User
 * @module sneusers/subdomains/users/entities/User
 */

/**
 * [Data access object][1] for the {@link DatabaseTable.USERS} table.
 *
 * [1]: https://en.wikipedia.org/wiki/Data_access_object
 *
 * @extends {BaseEntity<IUserRaw, CreateUserDTO, IUser>}
 * @implements {IUser}
 */
@Table<User>({
  deletedAt: false,
  hooks: {
    /**
     * Hashes a user's password before the user is persisted to the database.
     *
     * @async
     * @param {User} instance - Current user instance
     * @return {Promise<void>} Empty promise when complete
     */
    async beforeCreate(instance: User): Promise<void> {
      if (!instance.password) return
      instance.password = await User.scrypt.hash(instance.password)

      return
    },

    /**
     * Trims string fields and forces a user's email, first name, and last name
     * to be lowercased.
     *
     * @param {User} instance - Current user instance
     * @return {void} Nothing when complete
     */
    beforeSave(instance: User): void {
      instance.email = instance.email.toLowerCase().trim()
      instance.first_name = instance.first_name?.toLowerCase().trim() ?? null
      instance.last_name = instance.last_name?.toLowerCase().trim() ?? null

      if (instance.id) instance.id = Number.parseInt(instance.id.toString())

      return
    },

    /**
     * Prepares a {@link User} instance for validation.
     *
     * This includes:
     *
     * - Forcing the use of unix timestamps
     *
     * @param {User} instance - Current user instance
     * @return {void} Nothing when complete
     */
    beforeValidate(instance: User): void {
      const isNewRecord = !instance.id && !instance.updated_at

      if (isNewRecord) {
        const NOW = User.CURRENT_TIMESTAMP

        let created_at = instance.dataValues.created_at

        if (isDate(`${created_at}`)) created_at = new Date(created_at).getTime()

        if ((NOW as Literal).val === created_at) created_at = Date.now()

        instance.dataValues.created_at = created_at || Date.now()
        instance.dataValues.updated_at = null
      } else instance.dataValues.updated_at = Date.now()

      instance.isNewRecord = isNewRecord

      return
    }
  },
  omitNull: false,
  paranoid: false,
  tableName: DatabaseTable.USERS,
  timestamps: true
})
class User extends BaseEntity<IUserRaw, CreateUserDTO, IUser> implements IUser {
  @ApiProperty({ description: 'When user was created', type: Number })
  @Comment('when user was created (unix timestamp)')
  @Validate({ isUnixTimestamp: User.checkUnixTimestamp })
  @AllowNull(false)
  @Index('created_at')
  @Default(User.CURRENT_TIMESTAMP)
  @Column(DataType.BIGINT)
  declare created_at: IUser['created_at']

  @ApiProperty({
    description: 'Email address',
    maxLength: 254,
    minLength: 3,
    type: String
  })
  @Comment('unique email address')
  @Validate({ isEmail: true, len: [3, 254], notNull: true })
  @AllowNull(false)
  @Unique
  @Index('email')
  @Column(DataType.STRING(254))
  declare email: IUser['email']

  @ApiProperty({ description: 'Email address verified?', type: Boolean })
  @Comment('user verified?')
  @AllowNull(false)
  @Index('email_verified')
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare email_verified: IUser['email_verified']

  @ApiProperty({
    description: 'First name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @Comment('first name of user')
  @Validate({ len: [1, 255] })
  @Index('first_name')
  @Default(null)
  @Column(DataType.STRING)
  declare first_name: IUser['first_name']

  @ApiProperty({
    description: 'Last name',
    minLength: 1,
    nullable: true,
    type: String
  })
  @Comment('last name of user')
  @Validate({ len: [1, 255] })
  @Index('last_name')
  @Default(null)
  @Column(DataType.STRING)
  declare last_name: IUser['last_name']

  @ApiProperty({
    description: 'Hashed password',
    nullable: true,
    type: String
  })
  @Comment('hashed password')
  @Validate({ len: [8, 255], strong: User.checkPasswordStrength })
  @Default(null)
  @Column(DataType.STRING)
  declare password: IUser['password']

  @HasMany(() => Token)
  declare tokens: Token[]

  @ApiProperty({
    default: null,
    description: 'When user was last modified',
    nullable: true,
    type: Number
  })
  @Comment('when user was last modified (unix timestamp)')
  @Validate({ isUnixTimestamp: User.checkUnixTimestamp })
  @Index('updated_at')
  @Default(null)
  @Column(DataType.BIGINT)
  declare updated_at: IUser['updated_at']

  /**
   * Returns the user's full name.
   *
   * @return {NullishString} User's full name or `null`
   */
  @ApiProperty({ description: 'Full name (virtual property)' })
  @Column(DataType.VIRTUAL(DataType.STRING, ['first_name', 'last_name']))
  get name(): IUser['name'] {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim()
  }

  /**
   * @static
   * @readonly
   * @property {(keyof IUserRaw)[]} RAW_KEYS - {@link IUserRaw} attributes
   */
  static readonly RAW_KEYS: (keyof IUserRaw)[] = [
    'created_at',
    'email',
    'email_verified',
    'first_name',
    'id',
    'last_name',
    'password',
    'updated_at'
  ]

  /**
   * Checks a user's password strength.
   *
   * @static
   * @param {any} password - Password to check
   * @return {string} Password if strength check passes
   * @throws {Error | TypeError}
   */
  static checkPasswordStrength(password: any): NonNullable<User['password']> {
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
   * @param {string} email - Email address of user to find
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
      plain: true,
      where: {
        ...(options.where && {}),
        email: this.sequelize.fn('lower', email)
      }
    }

    try {
      return await this.findOne<User>(find_options)
    } catch (e) {
      const error = e as SequelizeError
      const data: ExceptionDataDTO<SequelizeError> = {
        email,
        options: find_options
      }

      if (error.name === SequelizeErrorName.EmptyResult) {
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
    if (!isEmail(uid.toString())) return await this.findByPk(uid, options)
    return await this.findByEmail(uid as string, options)
  }
}

export default User
