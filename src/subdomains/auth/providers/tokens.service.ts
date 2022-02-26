import { ExceptionCode } from '@flex-development/exceptions/enums'
import { NullishString, OrNull } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/sequelize'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { PaginatedDTO } from '@sneusers/dtos'
import { Exception } from '@sneusers/exceptions'
import type { EnvironmentVariables } from '@sneusers/models'
import { SequelizeError } from '@sneusers/modules/db/enums'
import { SearchOptions, SequelizeErrorType } from '@sneusers/modules/db/types'
import { User } from '@sneusers/subdomains/users/entities'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import { UserUid } from '@sneusers/subdomains/users/types'
import type { TokenExpiredError } from 'jsonwebtoken'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Sequelize } from 'sequelize-typescript'
import {
  CreateTokenDTO,
  JwtPayload,
  JwtPayloadAccess,
  JwtPayloadRefresh,
  JwtPayloadVerif,
  PatchTokenDTO,
  ResolvedToken
} from '../dtos'
import { Token } from '../entities'
import { TokenType } from '../enums'

/**
 * @file Auth Subdomain Providers - TokensService
 * @module sneusers/subdomains/auth/providers/TokensService
 */

@Injectable()
class TokensService {
  constructor(
    @InjectModel(Token) protected readonly repo: typeof Token,
    protected readonly sequelize: Sequelize,
    protected readonly users: UsersService,
    protected readonly jwt: JwtService,
    protected readonly config: ConfigService<EnvironmentVariables, true>
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
    const token = await this.sequelize.transaction(async transaction => {
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
        const error = e as SequelizeErrorType
        const data: ExceptionDataDTO<SequelizeErrorType> = { dto }

        if (error.name === SequelizeError.ForeignKeyConstraint) {
          data.code = ExceptionCode.UNPROCESSABLE_ENTITY
          data.message = `User with id [${dto.user}] does not exist`
        }

        throw Exception.fromSequelizeError(error, data)
      }
    })

    return token.reload()
  }

  /**
   * Generates an access token.
   *
   * @async
   * @param {Pick<IUserRaw, 'id'>} user - User to create access token for
   * @return {Promise<string>} Promise containing access token
   */
  async createAccessToken(user: Pick<IUserRaw, 'id'>): Promise<string> {
    const host = this.config.get<string>('HOST')
    const ttl = this.config.get<number>('JWT_EXP_ACCESS')

    const payload = { type: TokenType.ACCESS }
    const token = await this.create({
      ttl,
      type: payload.type,
      user: user.id
    })

    return this.jwt.signAsync(payload, {
      audience: host,
      expiresIn: ttl,
      issuer: host,
      jwtid: token.id.toString(),
      secret: this.config.get<string>('JWT_SECRET_ACCESS'),
      subject: token.user.toString()
    })
  }

  /**
   * Generates a raw refresh token.
   *
   * @async
   * @param {Pick<IUserRaw, 'id'>} user - User to create token for
   * @return {Promise<string>} Promise containing refresh token
   */
  async createRefreshToken(user: Pick<IUserRaw, 'id'>): Promise<string> {
    const host = this.config.get<string>('HOST')
    const ttl = this.config.get<number>('JWT_EXP_REFRESH')

    const payload = { type: TokenType.REFRESH }
    const token = await this.create({
      ttl,
      type: payload.type,
      user: user.id
    })

    return this.jwt.signAsync(payload, {
      audience: host,
      expiresIn: ttl,
      issuer: host,
      jwtid: token.id.toString(),
      secret: this.config.get<string>('JWT_SECRET_REFRESH'),
      subject: token.user.toString()
    })
  }

  /**
   * Generates a raw verification token.
   *
   * @async
   * @param {Pick<IUserRaw, 'email' | 'id'>} user - User to create token for
   * @return {Promise<string>} Promise containing verification token
   */
  async createVerificationToken(
    user: Pick<IUserRaw, 'email' | 'id'>
  ): Promise<string> {
    const host = this.config.get<string>('HOST')
    const ttl = this.config.get<number>('JWT_EXP_VERIFICATION')

    const payload = { type: TokenType.VERIFICATION }
    const token = await this.create({
      ttl,
      type: TokenType.VERIFICATION,
      user: user.id
    })

    return this.jwt.signAsync(payload, {
      audience: host,
      expiresIn: ttl,
      issuer: host,
      jwtid: token.id.toString(),
      secret: this.config.get<string>('JWT_SECRET_VERIFICATION'),
      subject: user.email
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
    return this.sequelize.transaction(async transaction => {
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
   * @see {@link JwtPayload}
   * @see {@link SearchOptions}
   *
   * @async
   * @param {JwtPayload} payload - JWT payload
   * @param {number} payload.jti - Id of assigned `Token`
   * @param {string} payload.sub - Id or email of `User` who token was issued to
   * @param {TokenType} payload.type - Token type
   * @param {SearchOptions<Token>} [options={}] - Search options
   * @return {Promise<OrNull<Token>>} - Promise containing token or `null`
   */
  async findByPayload(
    payload: JwtPayload,
    options: SearchOptions<Token> = {}
  ): Promise<OrNull<Token>> {
    return this.repo.findByPayload(payload, options)
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
    return this.sequelize.transaction(async transaction => {
      return this.repo.findByPk(id, { ...options, transaction })
    })
  }

  /**
   * Finds a token owner via `payload`.
   *
   * If an owner is found, but doesn't match user identified by `payload`, an
   * {@link Exception} will be thrown.
   *
   * @see {@link JwtPayload}
   * @see {@link SearchOptions}
   * @see {@link TokenType}
   * @see {@link User}
   *
   * @async
   * @param {JwtPayload} payload - JWT payload
   * @param {number} payload.jti - Id of assigned `Token`
   * @param {string} payload.sub - Id or email of `User` who token was issued to
   * @param {TokenType} payload.type - Token type
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<User>} - Promise containing token owner
   */
  async findOwnerByPayload(
    payload: JwtPayload,
    options: SearchOptions<User> = {}
  ): Promise<User> {
    return this.repo.findOwnerByPayload(payload, options)
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
      const entity = await this.repo.findByPk(id, {
        rejectOnEmpty: true,
        transaction
      })

      return entity!.update(dto, {
        fields: ['revoked'],
        silent: false,
        transaction,
        validate: true,
        where: { id: entity!.id }
      })
    })

    return token.reload()
  }

  /**
   * **Permanantly** deletes an existing token.
   *
   * @async
   * @param {number} id - Id of token to remove
   * @return {Promise<Token>} - Promise containing deleted token
   */
  async remove(id: number): Promise<Token> {
    return this.sequelize.transaction(async transaction => {
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
   * Retrieves a token instance and token owner.
   *
   * @async
   * @param {TokenType} type - Token type
   * @param {NullishString} auth_token - Token to resolve
   * @return {Promise<ResolvedToken>} Promise containing token and owner
   */
  async resolve(
    type: TokenType,
    auth_token: NullishString = null
  ): Promise<ResolvedToken> {
    const payload = await this.verify(type, auth_token)
    const token = (await this.findByPayload(payload, {
      rejectOnEmpty: true
    }))!

    if (token.revoked) {
      throw new Exception(ExceptionCode.UNPROCESSABLE_ENTITY, 'Token revoked', {
        payload
      })
    }

    return { token, user: await this.findOwnerByPayload(payload) }
  }

  /**
   * Marks a token as revoked.
   *
   * @async
   * @param {number} id - Id of token to revoke
   * @return {Promise<Token>} Promise containing revoked token
   */
  async revoke(id: number): Promise<Token> {
    return this.patch(id, { revoked: true })
  }

  /**
   * Resolves `token` and verifies the owner.
   *
   * @async
   * @param {TokenType} type - Token type
   * @param {NullishString} token - Token to resolve
   * @param {UserUid} uid - Token owner email or id
   * @return {Promise<ResolvedToken>} Promise containing token and owner
   * @throws {Exception}
   */
  async validate(
    type: TokenType,
    token: NullishString,
    uid: UserUid
  ): Promise<ResolvedToken> {
    const resolved = await this.resolve(type, token)
    const user = await this.users.findOne(uid, { rejectOnEmpty: false })

    if (resolved.user.id === user?.id) return resolved
    throw new Exception(ExceptionCode.UNAUTHORIZED, 'Unauthorized')
  }

  /**
   * Decodes a JSON web token.
   *
   * @param {TokenType} type - Token type
   * @param {NullishString} token - Token to verify
   * @return {Promise<JwtPayload>} Promise containing token payload
   */
  async verify(
    type: TokenType,
    token: NullishString
  ): Promise<
    {
      [TokenType.ACCESS]: JwtPayloadAccess
      [TokenType.REFRESH]: JwtPayloadRefresh
      [TokenType.VERIFICATION]: JwtPayloadVerif
    }[typeof type]
  > {
    try {
      if (!token) throw new JsonWebTokenError('jwt malformed')

      return this.jwt.verifyAsync(token, {
        secret: this.config.get<string>(`JWT_SECRET_${type}`)
      })
    } catch (e) {
      const error = e as JsonWebTokenError & TokenExpiredError
      const data: ExceptionDataDTO<JsonWebTokenError> = {
        errors: [error],
        message: 'Token malformed',
        token,
        type
      }

      if (error.expiredAt) data.message = 'Token expired'

      throw new Exception(
        ExceptionCode.UNPROCESSABLE_ENTITY,
        error.message,
        data,
        error.stack
      )
    }
  }

  /**
   * Retrieves the service repository instance.
   *
   * @return {typeof Token} Entity dao class
   */
  get repository(): typeof Token {
    return this.repo
  }
}

export default TokensService
