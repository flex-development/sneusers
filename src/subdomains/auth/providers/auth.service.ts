import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoginDTO } from '@sneusers/subdomains/auth/dtos'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import { UserUid } from '@sneusers/subdomains/users/types'
import TokensService from './tokens.service'

/**
 * @file Auth Subdomain Providers - AuthService
 * @module sneusers/subdomains/auth/providers/AuthService
 */

@Injectable()
class AuthService {
  constructor(
    protected readonly tokens: TokensService,
    protected readonly users: UsersService,
    protected readonly config: ConfigService
  ) {}

  /**
   * Retrieves the current {@link UsersService} instance.
   *
   * @return {TokensService} `TokensService` instance
   */
  get _tokens(): TokensService {
    return this.tokens
  }

  /**
   * Retrieves the current {@link UsersService} instance.
   *
   * @return {UsersService} `UsersService` instance
   */
  get _users(): UsersService {
    return this.users
  }

  /**
   * Verifies a user's authentication credentials.
   *
   * @async
   * @param {UserUid} uid - User email or id
   * @param {NullishString} [password=null] - User password
   * @param {NullishString} [refresh_token=null] - User refresh token
   * @return {Promise<User>} Promise containing authenticated user
   */
  async authenticate(
    uid: UserUid,
    password: User['password'] = null,
    refresh_token: NullishString = null
  ): Promise<User> {
    if (refresh_token) {
      return (await this.tokens.validateRefreshToken(refresh_token, uid)).user
    }

    return await this.users.authenticate(uid, password)
  }

  /**
   * Creates a cookie to clear a refresh token when user logs out.
   *
   * @return {string[]} Logout cookie
   */
  cookiesForLogout(): string[] {
    return ['Refresh=; HttpOnly; Secure=true; Path=/refresh; Max-Age=0']
  }

  /**
   * Creates a refresh token cookie.
   *
   * @param {Pick<IUserRaw, 'id'>} user - User to create cookie for
   * @param {NullishString} [refresh_token=null] - Existing refresh token
   * @return {Promise<string>} Promise containing refresh token cookie
   */
  async cookieWithRefreshToken(
    user: Pick<IUserRaw, 'id'>,
    refresh_token: NullishString = null
  ): Promise<string> {
    if (!refresh_token) {
      refresh_token = await this.tokens.createRefreshToken(user)
    }

    return [
      `Refresh=${refresh_token};`,
      `HttpOnly;`,
      `Secure=true;`,
      `Path=/refresh;`,
      `Max-Age=${this.config.get<string>('JWT_EXP_REFRESH')};`,
      'SameSite=strict;'
    ].join(' ')
  }

  /**
   * Logs in a user.
   *
   * @async
   * @param {Pick<IUserRaw, 'id'>} user - User to login
   * @return {Promise<LoginDTO>} Promise containing access token and user id
   */
  async login(user: Pick<IUserRaw, 'id'>): Promise<LoginDTO> {
    return {
      access_token: await this.tokens.createAccessToken(user),
      id: user.id
    }
  }

  /**
   * Generates a new access token for `user`.
   *
   * @async
   * @param {string} refresh_token - User's current refresh token
   * @return {Promise<LoginDTO>} Promise containing access token and user id
   */
  async refresh(refresh_token: string): Promise<LoginDTO> {
    const token = await this.tokens.resolveRefreshToken(refresh_token)

    await this.tokens.revokeRefreshToken(token.token.id)

    return {
      access_token: await this.tokens.createAccessToken(token.user),
      id: token.user.id
    }
  }

  /**
   * Creates and authenticates a new user.
   *
   * @async
   * @param {CreateUserDTO} dto - Data to create new user
   * @return {Promise<User>} - Promise containing new user
   */
  async register(dto: CreateUserDTO): Promise<User> {
    await this.users.create(dto)
    return await this.authenticate(dto.email, dto.password || null)
  }
}

export default AuthService
