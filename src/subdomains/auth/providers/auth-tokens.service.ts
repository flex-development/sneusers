import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import type { EnvironmentVariables } from '@sneusers/models'
import {
  JwtPayload,
  JwtPayloadAccess,
  JwtPayloadRefresh,
  JwtPayloadVerif,
  ResolvedToken
} from '@sneusers/subdomains/auth/dtos'
import { Token } from '@sneusers/subdomains/auth/entities'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import { UserUid } from '@sneusers/subdomains/users/types'
import type { TokenExpiredError } from 'jsonwebtoken'
import { JsonWebTokenError } from 'jsonwebtoken'
import TokensService from './tokens.service'

/**
 * @file Auth Subdomain Providers - AuthTokensService
 * @module sneusers/subdomains/auth/providers/AuthTokensService
 */

@Injectable()
export default class AuthTokensService {
  constructor(
    protected readonly users: UsersService,
    protected readonly tokens: TokensService,
    protected readonly jwt: JwtService,
    protected readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  /**
   * Generates an access token.
   *
   * @async
   * @param {Pick<IUserRaw, 'id'>} user - User to create access token for
   * @return {Promise<string>} Promise containing access token
   */
  async createAccessToken(user: Pick<IUserRaw, 'id'>): Promise<string> {
    const host = this.config.get<string>('HOST')
    const payload = {}

    return await this.jwt.signAsync(payload, {
      audience: host,
      issuer: host,
      subject: user.id.toString()
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
    const token = await this.tokens.create({
      ttl,
      type: TokenType.REFRESH,
      user: user.id
    })

    return await this.jwt.signAsync(payload, {
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
    const ttl = this.config.get<number>('JWT_EXP_VERIFY')

    const payload = { type: TokenType.VERIFICATION }
    const token = await this.tokens.create({
      ttl,
      type: TokenType.VERIFICATION,
      user: user.id
    })

    return await this.jwt.signAsync(payload, {
      audience: host,
      expiresIn: ttl,
      issuer: host,
      jwtid: token.id.toString(),
      secret: this.config.get<string>('JWT_SECRET_VERIFY'),
      subject: user.email
    })
  }

  /**
   * Retrieves a refresh or verification token instance and token owner.
   *
   * @async
   * @param {TokenType} type - Token type
   * @param {NullishString} auth_token - Token to resolve
   * @return {Promise<ResolvedToken>} Promise containing token and owner
   */
  async resolveToken(
    type: TokenType,
    auth_token: NullishString
  ): Promise<ResolvedToken> {
    const payload = await this.verify(type, auth_token)
    const token = (await this.tokens.findByPayload(payload, {
      rejectOnEmpty: true
    }))!

    if (token.revoked) {
      throw new Exception(ExceptionCode.UNPROCESSABLE_ENTITY, 'Token revoked', {
        payload
      })
    }

    return { token, user: await this.tokens.findOwnerByPayload(payload) }
  }

  /**
   * Marks a refresh or verification token as revoked.
   *
   * @async
   * @param {number} id - Id of refresh or verification token to revoke
   * @return {Promise<Token>} Promise containing revoked token
   */
  async revokeToken(id: number): Promise<Token> {
    return await this.tokens.revoke(id)
  }

  /**
   * Resolves a refresh or verification token and verifies the token owner.
   *
   * @async
   * @param {TokenType} type - Token type
   * @param {NullishString} auth_token - Refresh or verification token
   * @param {UserUid} uid - User email or id
   * @return {Promise<ResolvedToken>} Promise containing token and owner
   * @throws {Exception}
   */
  async validateToken(
    type: TokenType,
    auth_token: NullishString,
    uid: UserUid
  ): Promise<ResolvedToken> {
    const token = await this.resolveToken(type, auth_token)
    const user = await this.users.findOne(uid, { rejectOnEmpty: false })

    if (token.user.id === user?.id) return token
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
      access: JwtPayloadAccess
      [TokenType.REFRESH]: JwtPayloadRefresh
      [TokenType.VERIFICATION]: JwtPayloadVerif
    }[typeof type]
  > {
    try {
      if (!token) throw new JsonWebTokenError('jwt malformed')
      return this.jwt.verifyAsync(token)
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
}
