import type { ObjectPlain } from '@flex-development/tutils'
import { NullishString, OrNull } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SequelizeErrorName } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { QueryParams } from '@sneusers/models'
import { CreateUserDTO, PatchUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { UniqueEmailException } from '@sneusers/subdomains/users/exceptions'
import { IUser } from '@sneusers/subdomains/users/interfaces'
import { UserUid } from '@sneusers/subdomains/users/types'
import { SearchOptions, SequelizeError } from '@sneusers/types'
import { UniqueConstraintError } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

/**
 * @file Users Subdomain Providers - UsersService
 * @module sneusers/subdomains/users/providers/UsersService
 */

@Injectable()
export default class UsersService {
  constructor(
    @InjectModel(User) protected readonly repo: typeof User,
    protected readonly sequelize: Sequelize
  ) {}

  /**
   * Retrieves the service repository instance.
   *
   * @return {typeof User} Entity dao class
   */
  get repository(): typeof User {
    return this.repo
  }

  /**
   * Verifies a user's login credentials.
   *
   * @async
   * @param {UserUid} uid - User email or id
   * @param {NullishString} [password=null] - User password
   * @return {Promise<User>} Promise containing authenticated user
   */
  async authenticate(uid: UserUid, password: IUser['password']): Promise<User> {
    return await this.repo.authenticate(uid, password)
  }

  /**
   * Converts query parameters into a search options object.
   *
   * @param {QueryParams<IUser>} [query={}] - Query parameters
   * @return {SearchOptions<IUser>} Search options
   */
  buildSearchOptions(query: QueryParams<IUser> = {}): SearchOptions<IUser> {
    return this.repo.buildSearchOptions<IUser>(query)
  }

  /**
   * Creates a new user.
   *
   * If `dto.email` conflicts with an existing email, an error will be thrown.
   *
   * @async
   * @param {CreateUserDTO} dto - Data to create new user
   * @param {string} dto.email - User's email address
   * @param {string} dto.first_name - User's first name
   * @param {string} dto.last_name - User's last name
   * @return {Promise<User>} - Promise containing new user
   * @throws {Exception | UniqueEmailException}
   */
  async create(dto: CreateUserDTO): Promise<User> {
    return await this.sequelize.transaction(async transaction => {
      try {
        return await this.repo.create(dto, {
          fields: ['email', 'first_name', 'last_name', 'password'],
          isNewRecord: true,
          raw: true,
          silent: true,
          transaction,
          validate: true
        })
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
  }

  /**
   * Retrieves all entries from the `users` table.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {SearchOptions<IUser>} [options={}] - Search options
   * @return {Promise<User[]>} Array of `User` objects
   */
  async find(options: SearchOptions<IUser> = {}): Promise<User[]> {
    return await this.sequelize.transaction(async transaction => {
      return await this.repo.findAll<User>({ ...options, transaction })
    })
  }

  /**
   * Retrieve a user by {@link User#id} or {@link User#email} address.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {UserUid} uid - Id or email of user to find
   * @param {SearchOptions<IUser>} [options={}] - Search options
   * @return {Promise<OrNull<User>>} - Promise containing existing user
   */
  async findOne(
    uid: UserUid,
    options: SearchOptions<IUser> = {}
  ): Promise<OrNull<User>> {
    return await this.sequelize.transaction(async transaction => {
      return await this.repo.findByUid(uid, { ...options, transaction })
    })
  }

  /**
   * Updates an existing user.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to update
   * @param {PatchUserDTO} [dto={}] - Data to update user
   * @return {Promise<User>} - Promise containing updated user
   * @throws {Exception | UniqueEmailException}
   */
  async patch(uid: UserUid, dto: PatchUserDTO = {}): Promise<User> {
    return await this.sequelize.transaction(async transaction => {
      const search: SearchOptions = { rejectOnEmpty: true, transaction }
      const user = (await this.repo.findByUid(uid, search)) as User

      try {
        return await user.update(dto, {
          fields: ['email', 'first_name', 'last_name', 'password'],
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
  }

  /**
   * **Permanantly** deletes an existing user.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to remove
   * @return {Promise<User>} - Promise containing deleted user
   */
  async remove(uid: UserUid): Promise<User> {
    return await this.sequelize.transaction(async transaction => {
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
  }
}
