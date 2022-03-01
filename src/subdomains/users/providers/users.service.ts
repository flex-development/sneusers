import {
  NullishString,
  NumberString,
  ObjectPlain,
  OrNull
} from '@flex-development/tutils'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { PaginatedDTO } from '@sneusers/dtos'
import { ApiEndpoint } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import { SequelizeError } from '@sneusers/modules/db/enums'
import { SearchOptions, SequelizeErrorType } from '@sneusers/modules/db/types'
import { CreateEmailDTO } from '@sneusers/modules/email/dtos'
import { EmailService } from '@sneusers/modules/email/providers'
import { RedisCache } from '@sneusers/modules/redis/abstracts'
import { OAuthProvider } from '@sneusers/subdomains/auth/enums'
import { UniqueConstraintError } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import {
  CreateUserDTO,
  PatchUserDTO,
  UpsertUserDTO,
  UserEmailSentDTO
} from '../dtos'
import { User } from '../entities'
import { UniqueEmailException } from '../exceptions'
import { UserUid } from '../types'

/**
 * @file Users Subdomain Providers - UsersService
 * @module sneusers/subdomains/users/providers/UsersService
 */

@Injectable()
class UsersService {
  /**
   * @static
   * @readonly
   * @property {string} CACHE_KEY - Cache key
   */
  static readonly CACHE_KEY: string = ['/', ApiEndpoint.USERS].join('')

  constructor(
    @InjectModel(User) protected readonly repo: typeof User,
    protected readonly sequelize: Sequelize,
    @Inject(CACHE_MANAGER) protected readonly cache: RedisCache,
    protected readonly email: EmailService
  ) {}

  /**
   * Removes all cached items under {@link UsersService.CACHE_KEY}.
   *
   * @async
   * @return {Promise<boolean>} Boolean indicating if cache was cleared
   */
  async clearCache(): Promise<boolean> {
    for (const key of await this.cache.store.keys('*')) {
      key.startsWith(UsersService.CACHE_KEY) && (await this.cache.del(key))
    }

    return true
  }

  /**
   * Creates a new user.
   *
   * If `dto.email` conflicts with an existing email, an error will be thrown.
   *
   * If a password is supplied, it'll be hashed before being persisted.
   *
   * @see {@link CreateUserDTO}
   *
   * @async
   * @param {CreateUserDTO} dto - Data to create new user
   * @param {NullishString} [dto.display_name] - Display name
   * @param {string} dto.email - Unique email address
   * @param {NullishString} [dto.first_name] - First name
   * @param {NumberString} [dto.id] - Unique id
   * @param {NullishString} [dto.last_name] - Last name
   * @param {NullishString} [dto.password] - Plaintext password
   * @param {OrNull<OAuthProvider>} [dto.provider] - Authentication provider
   * @return {Promise<User>} - Promise containing new user
   * @throws {Exception | UniqueEmailException}
   */
  async create(dto: CreateUserDTO): Promise<User> {
    const user = await this.sequelize.transaction(async transaction => {
      try {
        return await this.repo.create(dto, {
          fields: [
            'display_name',
            'email',
            'email_verified', // must be included for triggers to fire correctly
            'first_name',
            'id',
            'last_name',
            'password',
            'provider'
          ],
          ignoreDuplicates: false,
          isNewRecord: true,
          raw: false,
          silent: true,
          transaction,
          validate: true
        })
      } catch (e) {
        const error = e as SequelizeErrorType
        const data: ObjectPlain = { dto }

        if (error instanceof UniqueConstraintError) {
          const pre = 'User with'
          const error_field = error.fields.hasOwnProperty('id') ? 'id' : 'email'
          const field = `[${error.fields[error_field]}]`

          data.message = [pre, error_field, field, 'already exists'].join(' ')
        }

        throw Exception.fromSequelizeError(error, data)
      }
    })

    await this.clearCache()
    return user.reload()
  }

  /**
   * Executes a {@link User} search.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<PaginatedDTO<User>>} Paginated `User` response
   */
  async find(options: SearchOptions<User> = {}): Promise<PaginatedDTO<User>> {
    return this.sequelize.transaction(async transaction => {
      const { count, rows } = await this.repo.findAndCountAll<User>({
        ...options,
        transaction
      })

      if (typeof options.limit === 'undefined') options.limit = rows.length
      if (typeof options.offset === 'undefined') options.offset = 0

      return new PaginatedDTO<User>({
        count,
        limit: options.limit,
        offset: options.offset,
        results: rows,
        total: rows.length
      })
    })
  }

  /**
   * Retrieve a {@link User} by `User#id` or `User#email`.
   *
   * If a user isn't found, `null` will be returned. To force the function to
   * throw an {@link Exception} instead, set `options.rejectOnEmpty=true`.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {UserUid} uid - Id or email of user to find
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<OrNull<User>>} - Promise containing existing user
   */
  async findOne(
    uid: UserUid,
    options: SearchOptions<User> = {}
  ): Promise<OrNull<User>> {
    return this.sequelize.transaction(async transaction => {
      return this.repo.findByUid(uid, { ...options, transaction })
    })
  }

  /**
   * Converts query parameters into a search options object.
   *
   * @see {@link QueryParams}
   * @see {@link SearchOptions}
   *
   * @param {QueryParams<User>} [query={}] - Query parameters
   * @return {SearchOptions<User>} Search options
   */
  getSearchOptions(query: QueryParams<User> = {}): SearchOptions<User> {
    return this.repo.getSearchOptions(query)
  }

  /**
   * Updates an existing user.
   *
   * If `dto.email` conflicts with an existing email, an error will be thrown.
   *
   * @see {@link PatchUserDTO}
   *
   * @template I - Allow internal-only updates
   *
   * @async
   * @param {UserUid} uid - Id or email of user to update
   * @param {PatchUserDTO<I>} [dto={}] - Data to update user
   * @return {Promise<User>} - Promise containing updated user
   * @throws {Exception | UniqueEmailException}
   */
  async patch<I extends 'internal' | never = never>(
    uid: UserUid,
    dto: PatchUserDTO<I> = {}
  ): Promise<User> {
    const user = await this.sequelize.transaction(async transaction => {
      const search: SearchOptions = { rejectOnEmpty: true, transaction }
      const entity = (await this.repo.findByUid(uid, search)) as User

      try {
        return await entity.update(dto, {
          fields: [
            'display_name',
            'email',
            'email_verified',
            'first_name',
            'last_name',
            'password',
            'provider'
          ],
          raw: false,
          silent: false,
          transaction,
          validate: true,
          where: { id: entity.id }
        })
      } catch (e) {
        const error = e as SequelizeErrorType
        const data: ObjectPlain = { dto }

        if (error.name === SequelizeError.UniqueConstraint) {
          throw new UniqueEmailException(
            data.dto.email,
            error as UniqueConstraintError,
            data
          )
        }

        throw Exception.fromSequelizeError(error, data)
      }
    })

    await this.clearCache()
    return user.reload()
  }

  /**
   * **Permanantly** deletes an existing user.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to remove
   * @return {Promise<User>} - Promise containing deleted user
   */
  async remove(uid: UserUid): Promise<User> {
    const user = await this.sequelize.transaction(async transaction => {
      const search: SearchOptions = { rejectOnEmpty: true, transaction }
      const entity = (await this.repo.findByUid(uid, search)) as User

      await this.repo.destroy({
        force: true,
        transaction,
        where: { id: entity.id }
      })

      return entity
    })

    await this.clearCache()
    return user
  }

  /**
   * Retrieves the service repository instance.
   *
   * @return {typeof User} Entity dao class
   */
  get repository(): typeof User {
    return this.repo
  }

  /**
   * Sends an email to a user.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to send email to
   * @param {CreateEmailDTO} options - Message options
   * @return {Promise<UserEmailSentDTO>} Email sent and user
   */
  async sendEmail(
    uid: UserUid,
    options: CreateEmailDTO
  ): Promise<UserEmailSentDTO> {
    const user = (await this.findOne(uid, { rejectOnEmpty: true })) as User
    const email = await this.email.send({ ...options, to: user.email })

    return { email, user }
  }

  /**
   * Creates or updates a user.
   *
   * @template I - Allow internal-only updates
   *
   * @async
   * @param {UpsertUserDTO<I>} [dto={}] - Data to create or update user
   * @param {NumberString} [dto.id] - Id of new user or id of user to update
   * @return {Promise<User>} - Promise containing new or updated user
   */
  async upsert<I extends 'internal' | never = never>(
    dto: UpsertUserDTO<I> = {}
  ): Promise<User> {
    const id = dto.id

    if (id && (await this.findOne(id))) return this.patch<I>(id, dto)
    return this.create(dto as CreateUserDTO)
  }

  /**
   * Marks a user as having had verified their email address.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to mark as email verified
   * @return {Promise<User>} - Promise containing updated user
   */
  async verifyEmail(uid: UserUid): Promise<User> {
    return this.patch<'internal'>(uid, { email_verified: true })
  }
}

export default UsersService
