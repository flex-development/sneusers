import type { ObjectPlain } from '@flex-development/tutils'
import { NullishString, OrNull } from '@flex-development/tutils'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CURRENT_TIMESTAMP } from '@sneusers/config/constants.config'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { BaseEntity } from '@sneusers/entities'
import {
  DatabaseTable,
  ExceptionCode,
  SequelizeErrorName
} from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { IUser, IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UserUid } from '@sneusers/subdomains/users/types'
import { SearchOptions, SequelizeError } from '@sneusers/types'
import crypto from 'crypto'
import pick from 'lodash.pick'
import {
  AllowNull,
  Column,
  Comment,
  DataType,
  Default,
  Index,
  Table,
  Unique,
  Validate
} from 'sequelize-typescript'
import sortObject from 'sort-object-keys'
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
 * @extends {BaseEntity<IUserRaw, CreateUserDTO>}
 * @implements {IUser}
 */
@Table<User>({
  hooks: {
    /**
     * Hashes a user's password before the user is persisted to the database.
     *
     * In addition to hashing passwords, all string fields will be lowercased
     * and trimmed.
     *
     * @async
     * @param {User} instance - Current user instance
     * @return {Promise<void>} Empty promise when complete
     */
    async beforeCreate(instance: User): Promise<void> {
      instance.email = instance.email.toLowerCase().trim()
      instance.first_name = instance.first_name.toLowerCase().trim()
      instance.last_name = instance.last_name.toLowerCase().trim()

      if (instance.password === null) return
      instance.password = await User.hashPassword(instance.password)

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
      const isNewRecord = instance.id === null && instance.updated_at === null

      if (isNewRecord) {
        let created_at = instance.dataValues.created_at

        if (isDate(`${created_at}`)) created_at = new Date(created_at).getTime()
        if (created_at.toString() === CURRENT_TIMESTAMP) created_at = Date.now()

        instance.dataValues.created_at = created_at || Date.now()
        instance.dataValues.updated_at = null
      } else instance.dataValues.updated_at = Date.now()

      instance.isNewRecord = isNewRecord

      return
    }
  },
  omitNull: false,
  tableName: DatabaseTable.USERS
})
class User extends BaseEntity<IUserRaw, CreateUserDTO> implements IUser {
  @ApiProperty({ description: 'When user was created', type: Number })
  @Comment('when user was created')
  @Validate({ isUnixTimestamp: User.checkUnixTimestamp })
  @AllowNull(false)
  @Index('created_at')
  @Default(CURRENT_TIMESTAMP)
  @Column('TIMESTAMP')
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

  @ApiProperty({ description: 'First name', minLength: 1, type: String })
  @Comment('first name of user')
  @Validate({ len: [1, 255], notNull: true })
  @AllowNull(false)
  @Index('first_name')
  @Column(DataType.STRING)
  declare first_name: IUser['first_name']

  @ApiProperty({ description: 'Last name', minLength: 1, type: String })
  @Comment('last name of user')
  @Validate({ len: [1, 255], notNull: true })
  @AllowNull(false)
  @Index('last_name')
  @Column(DataType.STRING)
  declare last_name: IUser['last_name']

  @ApiPropertyOptional({
    description: 'Hashed password',
    nullable: true,
    type: String
  })
  @Comment('hashed password')
  @Validate({ len: [8, 255], strong: User.checkPasswordStrength })
  @Default(null)
  @Column(DataType.STRING)
  declare password: IUser['password']

  @ApiProperty({
    default: null,
    description: 'When user was last modified',
    nullable: true,
    type: Number
  })
  @Comment('when user was last modified')
  @Validate({ isUnixTimestamp: User.checkUnixTimestamp })
  @Index('updated_at')
  @Default(null)
  @Column('TIMESTAMP')
  declare updated_at: IUser['updated_at']

  /**
   * Returns the user's full name.
   *
   * @return {string} User's full name
   */
  @ApiProperty({ description: 'Full name (virtual property)' })
  @Column(DataType.VIRTUAL(DataType.STRING, ['first_name', 'last_name']))
  get name(): string {
    return `${this.first_name} ${this.last_name}`
  }

  /**
   * @static
   * @readonly
   * @property {(keyof IUserRaw)[]} RAW_KEYS - {@link IUserRaw} attributes
   */
  static readonly RAW_KEYS: (keyof IUserRaw)[] = [
    'created_at',
    'email',
    'first_name',
    'id',
    'last_name',
    'password',
    'updated_at'
  ]

  /**
   * Verifies a user's login credentials.
   *
   * @static
   * @async
   * @param {string} email - User email
   * @param {NullishString} password - User password
   * @return {Promise<User>} Promise containing authenticated user
   * @throws {Exception}
   */
  static async authenticate(
    email: User['email'],
    password: User['password']
  ): Promise<User> {
    const options: SearchOptions<IUser> = { rejectOnEmpty: true }
    const user = (await this.findByEmail(email, options)) as User

    if (this.equal(user, { email })) {
      if (user.password === null && password === null) return user

      if (user.password && password) {
        await this.verifyPassword(user.password, password, user)
        return user
      }
    }

    throw new Exception(ExceptionCode.UNAUTHORIZED, 'Invalid credentials', {
      user: { email, id: user.id, password }
    })
  }

  /**
   * Checks a user's password strength.
   *
   * @static
   * @param {any} password - Password to check
   * @return {string} Password if strength check passes
   */
  static checkPasswordStrength(password: any): NonNullable<User['password']> {
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
   * @param {Partial<IUserRaw>} [user1] - First user
   * @param {Partial<IUserRaw>} [user2] - User to compare to `user1`
   * @return {boolean} `true` if id and email match, `false` otherwise
   */
  static equal(user1?: Partial<IUserRaw>, user2?: Partial<IUserRaw>): boolean {
    return (
      user1!.email!.toLowerCase() === user2!.email!.toLowerCase() ||
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
   * @param {SearchOptions<IUser>} [options={}] - Query options
   * @return {Promise<OrNull<User>>} `User` object or `null`
   * @throws {Exception}
   */
  static async findByEmail(
    email: IUser['email'],
    options: SearchOptions<IUser> = {}
  ): Promise<OrNull<User>> {
    const find_options: SearchOptions<IUser> = {
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
      const data: ObjectPlain = { options: find_options }

      if (error.name === SequelizeErrorName.EmptyResult) {
        data.message = `User with email [${email}] not found`
      }

      throw Exception.fromSequelizeError(error, data)
    }
  }

  /**
   * Retrieve a user by {@link User#id} or {@link User#email} address.
   *
   * If a user isn't found, `null` will be returned. To force the function to
   * throw an {@link Exception} instead, set `options.rejectOnEmpty=true`.
   *
   * @see {@link SearchOptions}
   *
   * @static
   * @async
   * @param {UserUid} uid - ID or email address of user to find
   * @param {SearchOptions<IUser>} [options={}] - Query options
   * @return {Promise<OrNull<User>>} `User` object or `null`
   * @throws {Exception}
   */
  static async findByUid(
    uid: UserUid,
    options: SearchOptions<IUser> = {}
  ): Promise<OrNull<User>> {
    if (isEmail(uid.toString())) return this.findByEmail(`${uid}`, options)

    if (typeof uid === 'string') uid = Number.parseInt(uid)
    if (!['bigint', 'number'].includes(typeof uid)) uid = Number.NaN
    if (Number.isNaN(uid)) uid = -1

    try {
      return await this.findByPk<User>(uid, { ...options, plain: true })
    } catch (e) {
      const error = e as SequelizeError
      const data: ObjectPlain = { options }

      if (error.name === SequelizeErrorName.EmptyResult) {
        data.message = `User with id [${uid}] not found`
      }

      throw Exception.fromSequelizeError(error, data)
    }
  }

  /**
   * Hashes a user password.
   *
   * @static
   * @async
   * @param {string} password - Password to hash
   * @return {Promise<string>} Promise containing hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex')

      crypto.scrypt(password, salt, 64, (error, derivedKey) => {
        if (error !== null) {
          const code = ExceptionCode.UNPROCESSABLE_ENTITY
          const message = 'Password hashing failure'
          const data: ExceptionDataDTO<Error> = {
            errors: [error],
            message: error.message,
            password,
            salt
          }

          reject(new Exception<Error>(code, message, data, error.stack))
        }

        resolve(`${salt}:${derivedKey.toString('hex')}`)
      })
    })
  }

  /**
   * Verifies a user password.
   *
   * @static
   * @async
   * @param {string} password_hashed - User's hashed password
   * @param {string} password - Password to test
   * @param {Partial<Pick<IUserRaw, 'email' | 'id'>>} [user={}] - Extra data
   * @return {Promise<boolean>} Promise containing `true` if verified
   * @throws {Exception}
   */
  static async verifyPassword(
    password_hashed: string,
    password: string,
    user: Partial<Pick<IUserRaw, 'email' | 'id'>> = {}
  ): Promise<boolean> {
    const verified = await new Promise<boolean>((resolve, reject) => {
      const [salt, key] = password_hashed.split(':')

      crypto.scrypt(password, salt as string, 64, (error, derivedKey) => {
        if (error !== null) {
          const code = ExceptionCode.UNAUTHORIZED
          const message = 'Password verification failure'
          const data: ExceptionDataDTO<Error> = {
            errors: [error],
            message: error.message,
            password
          }

          reject(new Exception<Error>(code, message, data, error.stack))
        }

        resolve(key === derivedKey.toString('hex'))
      })
    })

    if (!verified) {
      throw new Exception(ExceptionCode.UNAUTHORIZED, 'Invalid credentials', {
        user: sortObject({ password, ...pick(user, ['email', 'id']) })
      })
    }

    return verified
  }
}

export default User
