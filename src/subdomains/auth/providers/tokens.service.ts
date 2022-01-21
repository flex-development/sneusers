import { OrNull } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { PaginatedDTO } from '@sneusers/dtos'
import { ExceptionCode, SequelizeErrorName } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import {
  CreateTokenDTO,
  JwtPayloadToken,
  PatchTokenDTO
} from '@sneusers/subdomains/auth/dtos'
import { Token } from '@sneusers/subdomains/auth/entities'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { User } from '@sneusers/subdomains/users/entities'
import type { SequelizeError } from '@sneusers/types'
import { SearchOptions } from '@sneusers/types'
import { Sequelize } from 'sequelize-typescript'

/**
 * @file Auth Subdomain Providers - TokensService
 * @module sneusers/subdomains/auth/providers/TokensService
 */

@Injectable()
export default class TokensService {
  constructor(
    @InjectModel(Token) protected readonly repo: typeof Token,
    protected readonly sequelize: Sequelize
  ) {}

  /**
   * Creates a new token instance.
   *
   * If `dto.user` is not an existing {@link User} id, an error will be thrown.
   *
   * @see {@link CreateTokenDTO}
   *
   * @async
   * @param {CreateTokenDTO} dto - Data to create new token
   * @param {number} [dto.ttl=86400] - Time to live (in seconds)
   * @param {boolean} [dto.revoked=false] - Revoke token when created
   * @param {TokenType} dto.type - Type of token to create
   * @param {number} dto.user - Token owner id
   * @return {Promise<Token>} Promise containing new token instance
   * @throws {Exception}
   */
  async create(dto: CreateTokenDTO): Promise<Token> {
    return await this.sequelize.transaction(async transaction => {
      try {
        return await this.repo.create(dto, {
          fields: ['revoked', 'ttl', 'type', 'user'],
          isNewRecord: true,
          raw: true,
          silent: true,
          transaction,
          validate: true
        })
      } catch (e) {
        const error = e as SequelizeError
        const data: ExceptionDataDTO<SequelizeError> = { dto }

        if (error.name === SequelizeErrorName.ForeignKeyConstraint) {
          data.code = ExceptionCode.UNPROCESSABLE_ENTITY
          data.message = `User with id [${dto.user}] does not exist`
        }

        throw Exception.fromSequelizeError(error, data)
      }
    })
  }

  /**
   * Executes a {@link Token} search.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {SearchOptions<Token>} [options={}] - Search options
   * @return {Promise<PaginatedDTO<Token>>} Paginated `Token` response
   */
  async find(options: SearchOptions<Token> = {}): Promise<PaginatedDTO<Token>> {
    return await this.sequelize.transaction(async transaction => {
      const { count, rows } = await this.repo.findAndCountAll<Token>({
        ...options,
        transaction
      })

      if (typeof options.limit === 'undefined') options.limit = rows.length
      if (typeof options.offset === 'undefined') options.offset = 0

      return new PaginatedDTO<Token>({
        count,
        limit: options.limit,
        offset: options.offset,
        results: rows,
        total: rows.length
      })
    })
  }

  /**
   * Finds a {@link Token} via payload.
   *
   * If a token isn't found, `null` will be returned. To force the function to
   * throw an {@link Exception} instead, set `options.rejectOnEmpty=true`.
   *
   * @see {@link JwtPayloadToken}
   * @see {@link SearchOptions}
   *
   * @async
   * @param {JwtPayloadToken} payload - JWT payload
   * @param {number} payload.jti - Id of assigned `Token`
   * @param {string} payload.sub - Id or email of `User` who token was issued to
   * @param {TokenType} payload.type - Token type
   * @param {SearchOptions<Token>} [options={}] - Search options
   * @return {Promise<OrNull<Token>>} - Promise containing token
   */
  async findByPayload(
    payload: JwtPayloadToken,
    options: SearchOptions<Token> = {}
  ): Promise<OrNull<Token>> {
    return await this.repo.findByPayload(payload, options)
  }

  /**
   * Retrieve a {@link Token} by `id`.
   *
   * If a token isn't found, `null` will be returned. To force the function to
   * throw an {@link Exception} instead, set `options.rejectOnEmpty=true`.
   *
   * @see {@link SearchOptions}
   *
   * @async
   * @param {number} id - Id of token to find
   * @param {SearchOptions<Token>} [options={}] - Search options
   * @return {Promise<OrNull<Token>>} - Promise containing existing token
   */
  async findOne(
    id: Token['id'],
    options: SearchOptions<Token> = {}
  ): Promise<OrNull<Token>> {
    return await this.sequelize.transaction(async transaction => {
      return await this.repo.findByPk(id, { ...options, transaction })
    })
  }

  /**
   * Finds a token owner via payload.
   *
   * If an owner is found, but doesn't match user identified by `payload`, an
   * {@link Exception} will be thrown.
   *
   * @see {@link JwtPayloadToken}
   * @see {@link SearchOptions}
   * @see {@link TokenType}
   * @see {@link User}
   *
   * @async
   * @param {JwtPayloadToken} payload - JWT payload
   * @param {number} payload.jti - Id of assigned `Token`
   * @param {string} payload.sub - Id or email of `User` who token was issued to
   * @param {TokenType} payload.type - Token type
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<User>} - Promise containing token owner
   */
  async findOwnerByPayload(
    payload: JwtPayloadToken,
    options: SearchOptions<User> = {}
  ): Promise<User> {
    return await this.repo.findOwnerByPayload(payload, options)
  }

  /**
   * Updates an existing token.
   *
   * @async
   * @param {number} id - Id of token to update
   * @param {PatchTokenDTO} [dto={}] - Data to update token
   * @param {boolean} [dto.revoked] - Update revocation status
   * @return {Promise<Token>} - Promise containing updated token
   */
  async patch(id: number, dto: PatchTokenDTO = {}): Promise<Token> {
    const token = await this.sequelize.transaction(async transaction => {
      const token = await this.repo.findByPk(id, {
        rejectOnEmpty: true,
        transaction
      })

      return await token!.update(dto, {
        fields: ['revoked'],
        silent: false,
        transaction,
        validate: true,
        where: { id: token!.id }
      })
    })

    return await token.reload()
  }

  /**
   * **Permanantly** deletes an existing token.
   *
   * @async
   * @param {number} id - Id of token to remove
   * @return {Promise<Token>} - Promise containing deleted token
   */
  async remove(id: number): Promise<Token> {
    return await this.sequelize.transaction(async transaction => {
      const token = await this.repo.findByPk(id, {
        rejectOnEmpty: true,
        transaction
      })

      await this.repo.destroy({
        cascade: true,
        force: true,
        transaction,
        where: { id: token!.id }
      })

      return token!
    })
  }

  /**
   * Retrieves the service repository instance.
   *
   * @return {typeof Token} Entity dao class
   */
  get repository(): typeof Token {
    return this.repo
  }

  /**
   * Marks a token as revoked.
   *
   * @async
   * @param {number} id - Id of token to revoke
   * @return {Promise<Token>} Promise containing revoked token
   */
  async revoke(id: number): Promise<Token> {
    return await this.patch(id, { revoked: true })
  }
}
