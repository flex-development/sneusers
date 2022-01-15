import { OrNull } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Exception } from '@sneusers/exceptions'
import {
  CreateRefreshTokenDTO,
  PatchRefreshTokenDTO,
  RefreshTokenPayload
} from '@sneusers/subdomains/auth/dtos'
import { RefreshToken } from '@sneusers/subdomains/auth/entities'
import { IRefreshTokenRaw } from '@sneusers/subdomains/auth/interfaces'
import { User } from '@sneusers/subdomains/users/entities'
import { SearchOptions, SequelizeError } from '@sneusers/types'
import { Sequelize } from 'sequelize-typescript'

/**
 * @file Auth Subdomain Providers - RefreshTokensService
 * @module sneusers/subdomains/auth/providers/RefreshTokensService
 */

@Injectable()
export default class RefreshTokensService {
  constructor(
    @InjectModel(RefreshToken) protected readonly repo: typeof RefreshToken,
    protected readonly sequelize: Sequelize
  ) {}

  /**
   * Retrieves the service repository instance.
   *
   * @return {typeof RefreshToken} Entity dao class
   */
  get repository(): typeof RefreshToken {
    return this.repo
  }

  /**
   * Creates a new refresh token instance.
   *
   * @async
   * @param {CreateRefreshTokenDTO} dto - Data to create new refresh token
   * @param {number} [dto.ttl=86400] - Time to live (in seconds)
   * @param {number} dto.user - Token owner id
   * @return {Promise<RefreshToken>} Promise containing new token instance
   * @throws {Exception}
   */
  async create(dto: CreateRefreshTokenDTO): Promise<RefreshToken> {
    return await this.sequelize.transaction(async transaction => {
      const data: Omit<IRefreshTokenRaw, 'id'> = {
        expires: new Date().getTime() + (dto?.ttl ?? 86_400),
        revoked: false,
        user: dto.user
      }

      try {
        return await this.repo.create(data, {
          fields: ['expires', 'revoked', 'user'],
          isNewRecord: true,
          raw: true,
          silent: true,
          transaction,
          validate: true
        })
      } catch (e) {
        throw Exception.fromSequelizeError(e as SequelizeError, dto)
      }
    })
  }

  /**
   * Retrieves all entries from the `refresh_tokens` table.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {SearchOptions<IRefreshTokenRaw>} [options={}] - Search options
   * @return {Promise<RefreshToken[]>} Array of `RefreshToken` objects
   */
  async find(
    options: SearchOptions<IRefreshTokenRaw> = {}
  ): Promise<RefreshToken[]> {
    return await this.sequelize.transaction(async transaction => {
      return await this.repo.findAll<RefreshToken>({
        ...options,
        transaction
      })
    })
  }

  /**
   * Finds a token via payload.
   *
   * @async
   * @param {RefreshTokenPayload} payload - Token payload
   * @return {Promise<OrNull<RefreshToken>>} - Promise containing refresh token
   * @throws {Exception}
   */
  async findByPayload(
    payload: RefreshTokenPayload
  ): Promise<OrNull<RefreshToken>> {
    return await this.repo.findByPayload(payload)
  }

  /**
   * Retrieve a token by {@link RefreshToken#id}.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {number} id - Refresh token id
   * @param {SearchOptions<IRefreshTokenRaw>} [options={}] - Search options
   * @return {Promise<OrNull<RefreshToken>>} - Promise containing existing token
   */
  async findOne(
    id: RefreshToken['id'],
    options: SearchOptions<IRefreshTokenRaw> = {}
  ): Promise<OrNull<RefreshToken>> {
    return await this.sequelize.transaction(async transaction => {
      return await this.repo.findByPk(id, { ...options, transaction })
    })
  }

  /**
   * Finds a token owner via payload.
   *
   * @async
   * @param {RefreshTokenPayload} payload - Token payload
   * @return {Promise<OrNull<User>>} - Promise containing token owner
   * @throws {Exception}
   */
  async findOwnerByPayload(
    payload: RefreshTokenPayload
  ): Promise<OrNull<User>> {
    return await this.repo.findOwnerByPayload(payload)
  }

  /**
   * Updates an existing refresh token.
   *
   * @async
   * @param {number} id - Id of refresh token to update
   * @param {PatchRefreshTokenDTO} [dto={}] - Data to update refresh token
   * @param {boolean} [dto.revoked] - Update revocation status
   * @return {Promise<RefreshToken>} - Promise containing updated refresh token
   * @throws {Exception}
   */
  async patch(
    id: number,
    dto: PatchRefreshTokenDTO = {}
  ): Promise<RefreshToken> {
    return await this.sequelize.transaction(async transaction => {
      const search: SearchOptions = { rejectOnEmpty: true, transaction }
      const token = (await this.repo.findByPk(id, search)) as RefreshToken

      try {
        return await token.update(dto, {
          fields: ['revoked'],
          silent: false,
          transaction,
          validate: true,
          where: { id: token.id }
        })
      } catch (e) {
        throw Exception.fromSequelizeError(e as SequelizeError, { dto })
      }
    })
  }

  /**
   * **Permanantly** deletes an existing refresh token.
   *
   * @async
   * @param {number} id - Id of refresh token to remove
   * @return {Promise<RefreshToken>} - Promise containing deleted refresh token
   */
  async remove(id: number): Promise<RefreshToken> {
    return await this.sequelize.transaction(async transaction => {
      const search: SearchOptions = { rejectOnEmpty: true, transaction }
      const token = (await this.repo.findByPk(id, search)) as RefreshToken

      await this.repo.destroy({
        cascade: true,
        force: true,
        transaction,
        where: { id: token.id }
      })

      return token
    })
  }

  /**
   * Marks a refresh token as revoked.
   *
   * @async
   * @param {number} id - Id of refresh token to revoke
   * @return {Promise<RefreshToken>} Promise containing revoked refresh token
   * @throws {Exception}
   */
  async revoke(id: number): Promise<RefreshToken> {
    return await this.patch(id, { revoked: true })
  }
}
