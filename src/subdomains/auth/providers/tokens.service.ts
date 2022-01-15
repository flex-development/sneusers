import { NullishString } from '@flex-development/tutils/cjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { ExceptionDataDTO } from '@sneusers/dtos'
import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import type { EnvironmentVariables } from '@sneusers/models'
import {
  AccessTokenPayload,
  JwtPayload,
  RefreshTokenPayload,
  ResolvedRefreshToken
} from '@sneusers/subdomains/auth/dtos'
import { RefreshToken } from '@sneusers/subdomains/auth/entities'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import { UserUid } from '@sneusers/subdomains/users/types'
import type { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import RefreshTokensService from './refresh-tokens.service'

/**
 * @file Auth Subdomain Providers - TokensService
 * @module sneusers/subdomains/auth/providers/TokensService
 */

@Injectable()
export default class TokensService {
  constructor(
    protected readonly config: ConfigService<EnvironmentVariables, true>,
    protected readonly jwt: JwtService,
    protected readonly refresh_tokens: RefreshTokensService,
    protected readonly users: UsersService
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

    const payload = {}
    const token = await this.refresh_tokens.create({ ttl, user: user.id })

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
   * Retrieves a refresh token instance and token owner.
   *
   * @async
   * @param {string} refresh_token - Refresh token to resolve
   * @return {Promise<ResolvedRefreshToken>} Promise containing token and owner
   */
  async resolveRefreshToken(
    refresh_token: string
  ): Promise<ResolvedRefreshToken> {
    const payload = await this.verify('refresh', refresh_token)
    const token = await this.refresh_tokens.findByPayload(payload)

    if (!token) {
      throw new Exception(
        ExceptionCode.UNPROCESSABLE_ENTITY,
        'Refresh token not found',
        payload
      )
    }

    if (token.revoked) {
      throw new Exception(
        ExceptionCode.UNPROCESSABLE_ENTITY,
        'Refresh token revoked',
        payload
      )
    }

    const user = await this.refresh_tokens.findOwnerByPayload(payload)

    if (!user) {
      throw new Exception(
        ExceptionCode.UNPROCESSABLE_ENTITY,
        'Refresh token malformed',
        payload
      )
    }

    return { token, user }
  }

  /**
   * Marks a refresh token as revoked.
   *
   * @async
   * @param {number} id - Id of refresh token to revoke
   * @return {Promise<RefreshToken>} Promise containing revoked refresh token
   */
  async revokeRefreshToken(id: number): Promise<RefreshToken> {
    return await this.refresh_tokens.revoke(id)
  }

  /**
   * Resolves a refresh token and verifies the token owner.
   *
   * @async
   * @param {NullishString} [refresh_token=null] - User refresh token
   * @param {UserUid} uid - User email or id
   * @return {Promise<ResolvedRefreshToken>} Promise containing token and owner
   * @throws {Exception}
   */
  async validateRefreshToken(
    refresh_token: NullishString,
    uid: UserUid
  ): Promise<ResolvedRefreshToken> {
    if (refresh_token) {
      const token = await this.resolveRefreshToken(refresh_token)
      const user = await this.users.findOne(uid, { rejectOnEmpty: false })

      if (token.user.id === user?.id) return token
      throw new Exception(ExceptionCode.UNAUTHORIZED, 'Unauthorized')
    }

    throw new Exception(
      ExceptionCode.UNPROCESSABLE_ENTITY,
      'Refresh token not found',
      { refresh_token }
    )
  }

  /**
   * Decodes a JSON web token.
   *
   * @template T - Token type
   *
   * @param {'access' | 'refresh'} type - Token type
   * @param {string} token - Token to verify
   * @return {Promise<JwtPayload>} Promise containing token payload
   */
  async verify<T extends 'access' | 'refresh'>(
    type: T,
    token: string
  ): Promise<T extends 'access' ? AccessTokenPayload : RefreshTokenPayload> {
    const TYPE = `${type.charAt(0).toUpperCase()}${type.slice(1, type.length)}`

    try {
      return this.jwt.verifyAsync(token)
    } catch (e) {
      const error = e as JsonWebTokenError & TokenExpiredError
      const data: ExceptionDataDTO<JsonWebTokenError> = {
        errors: [error],
        message: `${TYPE} token malformed`,
        token
      }

      if (error.expiredAt) data.message = `${TYPE} token expired`

      throw new Exception(
        ExceptionCode.UNPROCESSABLE_ENTITY,
        error.message,
        data,
        error.stack
      )
    }
  }
}
