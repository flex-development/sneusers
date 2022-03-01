import { ExceptionCode } from '@flex-development/exceptions/enums'
import { NullishString, OrUndefined } from '@flex-development/tutils'
import { isNIL } from '@flex-development/tutils/guards'
import { Injectable } from '@nestjs/common'
import { Exception } from '@sneusers/exceptions'
import { ScryptService } from '@sneusers/modules/crypto/providers'
import { SearchOptions } from '@sneusers/modules/db/types'
import { User } from '@sneusers/subdomains/users/entities'
import { UsersService } from '@sneusers/subdomains/users/providers'
import { UserUid } from '@sneusers/subdomains/users/types'
import type { Numeric } from '@sneusers/types'
import { GoogleCallbackParameters } from 'passport-google-oauth20'
import { JwtPayload, ResolvedToken } from '../dtos'
import { OAuthProvider, TokenType } from '../enums'
import { OAuthUserProfile } from '../namespaces'
import TokensService from './tokens.service'

/**
 * @file Auth Subdomain Providers - Strategist
 * @module sneusers/subdomains/auth/providers/Strategist
 */

@Injectable()
class Strategist {
  constructor(
    protected readonly users: UsersService,
    protected readonly tokens: TokensService,
    protected readonly scrypt: ScryptService
  ) {}

  /**
   * Authenticates a user via GitHub OAuth `profile`.
   *
   * @async
   * @param {string} access_token - GitHub user access token
   * @param {OrUndefined<string>} refresh_token - GitHub user refresh token
   * @param {OAuthUserProfile.GitHub} profile - GitHub user profile
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validateGitHub(
    access_token: string,
    refresh_token: OrUndefined<string>,
    profile: OAuthUserProfile.GitHub
  ): Promise<User> {
    return this.users.upsert<'internal'>({
      display_name: profile.name,
      email: profile.email!,
      first_name: profile.name,
      id: profile.id,
      last_name: null,
      provider: OAuthProvider.GITHUB
    })
  }

  /**
   * Authenticates a user via Google OAuth `profile`.
   *
   * @async
   * @param {string} access_token - Google user access token
   * @param {OrUndefined<string>} refresh_token - Google user refresh token
   * @param {GoogleCallbackParameters} params - Google callback parameters
   * @param {OAuthUserProfile.Google} profile - Google user profile
   * @return {Promise<User>} Promise containing authenticated user
   */
  async validateGoogle(
    access_token: string,
    refresh_token: OrUndefined<string>,
    params: GoogleCallbackParameters,
    profile: OAuthUserProfile.Google
  ): Promise<User> {
    return this.users.upsert<'internal'>({
      email: profile.email,
      first_name: profile.given_name,
      id: profile.sub as Numeric,
      last_name: profile.family_name,
      provider: OAuthProvider.GOOGLE
    })
  }

  /**
   * Authenticates a user using an `email` and `password`.
   *
   * @async
   * @param {string} email - User email
   * @param {NullishString} [password=null] - User password
   * @return {Promise<User>} Promise containing authenticated user
   * @throws {Exception}
   */
  async validateLocal(
    email: User['email'],
    password: User['password'] = null
  ): Promise<User> {
    const user = (await this.users.findOne(email, { rejectOnEmpty: true }))!

    if (!isNIL(user.provider)) {
      const message = 'Provider authentication required'

      throw new Exception(ExceptionCode.FORBIDDEN, message, {
        provider: user.provider,
        user: { email: user.email, id: user.id }
      })
    }

    if (user.password === null && password === null) return user

    try {
      await this.scrypt.verify(user.password, password)
    } catch (error) {
      const exception = error as Exception

      Object.assign(exception, {
        data: { user: { email: user.email, id: user.id, password } }
      })

      if (exception.message === 'Invalid credential') {
        Object.assign(exception, { message: 'Invalid login credentials' })
      }

      throw exception
    }

    return user
  }

  /**
   * Authenticates a user via `payload`.
   *
   * @async
   * @param {JwtPayload} payload - JWT payload
   * @param {number} payload.jti - Id of assigned `Token`
   * @param {string} payload.sub - Id or email of `User` who token was issued to
   * @param {TokenType} payload.type - Token type
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<User>} - Promise containing token owner
   */
  async validatePayload(
    payload: JwtPayload,
    options: SearchOptions<User> = {}
  ): Promise<User> {
    return this.tokens.findOwnerByPayload(payload, options)
  }

  /**
   * Resolves `token` and verifies the owner.
   *
   * @async
   * @param {TokenType} type - Token type
   * @param {NullishString} token - Token to resolve
   * @param {UserUid} uid - Token owner email or id
   * @return {Promise<ResolvedToken>} Promise containing token and owner
   */
  async validateToken(
    type: TokenType,
    token: NullishString,
    uid: UserUid
  ): Promise<ResolvedToken> {
    return this.tokens.validate(type, token, uid)
  }
}

export default Strategist
