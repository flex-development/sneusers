import {
  NullishString,
  NumberString,
  ObjectPlain,
  OrNull
} from '@flex-development/tutils'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { PaginatedDTO } from '@sneusers/dtos'
import { SequelizeErrorName } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import { CreateEmailDTO } from '@sneusers/modules/email/dtos'
import { EMAIL_SERVICE } from '@sneusers/modules/email/email.module.constants'
import { EmailService } from '@sneusers/modules/email/providers'
import {
  CreateUserDTO,
  PatchUserDTO,
  UpsertUserDTO,
  UserEmailSentDTO
} from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import { UserUid } from '@sneusers/subdomains/users/types'
import { SearchOptions, SequelizeError } from '@sneusers/types'
import { Cache } from 'cache-manager'
import { UniqueConstraintError } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import OPENAPI from '../controllers/openapi/users.openapi'

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
  static readonly CACHE_KEY: string = ['/', OPENAPI.controller].join('')

  constructor(
    @InjectModel(User) protected readonly repo: typeof User,
    @Inject(Sequelize) protected readonly sequelize: Sequelize,
    @Inject(EMAIL_SERVICE) protected readonly email: EmailService,
    @Inject(CACHE_MANAGER) protected readonly cache: Cache
  ) {}

  /**
   * Verifies a user's login credentials.
   *
   * @async
   * @param {UserUid} uid - User email or id
   * @param {NullishString} [password=null] - User password
   * @return {Promise<User>} Promise containing authenticated user
   */
  async authenticate(uid: UserUid, password: User['password']): Promise<User> {
    return await this.repo.authenticate(uid, password)
  }

  /**
   * Removes all cached items under {@link UsersService.CACHE_KEY}.
   *
   * @async
   * @return {Promise<boolean>} Boolean indicating if cache was cleared
   */
  async clearCache(): Promise<boolean> {
    if (!this.cache.store.keys) return false

    for (const key of await this.cache.store.keys()) {
      if (key.startsWith(UsersService.CACHE_KEY)) await this.cache.del(key)
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
   * @param {string} dto.email - Unique email address
   * @param {NullishString} [dto.first_name] - First name
   * @param {NumberString} [dto.id] - Unique id
   * @param {NullishString} [dto.last_name] - Last name
   * @param {NullishString} [dto.password] - Plaintext password
   * @return {Promise<User>} - Promise containing new user
   * @throws {Exception | UniqueEmailException}
   */
  async create(dto: CreateUserDTO): Promise<User> {
    const user = await this.sequelize.transaction(async transaction => {
      try {
        const user = await this.repo.create(dto, {
          fields: ['email', 'first_name', 'id', 'last_name', 'password'],
          isNewRecord: true,
          raw: true,
          silent: true,
          transaction,
          validate: true
        })

        return user
      } catch (e) {
        const error = e as SequelizeError
        const data: ObjectPlain = { dto }

        if (error.name === SequelizeErrorName.UniqueConstraint) {
          throw new UniqueEmailException(
            dto.email,
            error as UniqueConstraintError
          )
        }

        throw Exception.fromSequelizeError(error, data)
      }
    })

    await this.clearCache()
    return user
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
    return await this.sequelize.transaction(async transaction => {
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
    return await this.sequelize.transaction(async transaction => {
      return await this.repo.findByUid(uid, { ...options, transaction })
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
   * @template Internal - Allow internal-only updates
   *
   * @async
   * @param {UserUid} uid - Id or email of user to update
   * @param {PatchUserDTO} [dto={}] - Data to update user
   * @return {Promise<User>} - Promise containing updated user
   * @throws {Exception | UniqueEmailException}
   */
  async patch<Internal extends 'internal' | never = never>(
    uid: UserUid,
    dto: PatchUserDTO<Internal> = {}
  ): Promise<User> {
    const user = await this.sequelize.transaction(async transaction => {
      const search: SearchOptions = { rejectOnEmpty: true, transaction }
      const user = (await this.repo.findByUid(uid, search)) as User

      try {
        return await user.update(dto, {
          fields: [
            'email',
            'email_verified',
            'first_name',
            'last_name',
            'password'
          ],
          silent: false,
          transaction,
          validate: true,
          where: { id: user.id }
        })
      } catch (e) {
        const error = e as SequelizeError
        const data: ObjectPlain = { dto }

        if (error.name === SequelizeErrorName.UniqueConstraint) {
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
    return await user.reload()
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
      const user = (await this.repo.findByUid(uid, search)) as User

      await this.repo.destroy({
        cascade: true,
        force: true,
        transaction,
        where: { id: user.id }
      })

      return user
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
   * @async
   * @param {UpsertUserDTO} [dto={}] - Data to create or update user
   * @param {NumberString} [dto.id] - Id of new user or id of user to update
   * @return {Promise<User>} - Promise containing new or updated user
   */
  async upsert(dto: UpsertUserDTO = {}): Promise<User> {
    const id = dto.id

    if (id && (await this.findOne(id))) return await this.patch(id, dto)
    return await this.create(dto as CreateUserDTO)
  }

  /**
   * Marks a user as having had verified their email address.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to mark as email verified
   * @return {Promise<User>} - Promise containing updated user
   */
  async verifyEmail(uid: UserUid): Promise<User> {
    return await this.patch<'internal'>(uid, { email_verified: true })
  }
}

export default UsersService
