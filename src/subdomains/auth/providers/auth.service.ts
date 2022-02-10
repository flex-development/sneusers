import { NullishString, NumberString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoginDTO, RegisterUserDTO } from '@sneusers/subdomains/auth/dtos'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { User } from '@sneusers/subdomains/users/entities'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import Strategist from './strategist.provider'
import TokensService from './tokens.service'
import VerificationService from './verification.service'

/**
 * @file Auth Subdomain Providers - AuthService
 * @module sneusers/subdomains/auth/providers/AuthService
 */

@Injectable()
class AuthService {
  constructor(
    protected readonly strategist: Strategist,
    protected readonly tokens: TokensService,
    protected readonly users: UsersService,
    protected readonly config: ConfigService,
    protected readonly verification: VerificationService
  ) {}

  /**
   * Logs in a user.
   *
   * @async
   * @param {Pick<IUserRaw, 'id'>} user - User to login
   * @return {Promise<[LoginDTO, string]>} Access and refresh tokens
   */
  async login(user: Pick<IUserRaw, 'id'>): Promise<[LoginDTO, string]> {
    const access_token = await this.tokens.createAccessToken(user)
    const refresh_token = await this.tokens.createRefreshToken(user)

    return [new LoginDTO(access_token), refresh_token]
  }

  /**
   * Generates a new access token for a user.
   *
   * @async
   * @param {NullishString} [refresh_token=null] - User refresh token
   * @return {Promise<LoginDTO>} New access token
   */
  async refresh(refresh_token: NullishString = null): Promise<LoginDTO> {
    const token = await this.tokens.resolve(TokenType.REFRESH, refresh_token)

    await this.tokens.revoke(token.token.id)

    return new LoginDTO(await this.tokens.createAccessToken(token.user))
  }

  /**
   * Creates a new user using an email and password. New users will receive a
   * verification email upon successful registration.
   *
   * @async
   * @param {RegisterUserDTO} dto - Registration data
   * @param {NullishString} [dto.display_name] - Display name
   * @param {string} dto.email - Unique email address
   * @param {NullishString} [dto.first_name] - First name
   * @param {NumberString} [dto.id] - Unique id
   * @param {NullishString} [dto.last_name] - Last name
   * @param {string} [dto.password] - Plaintext password
   * @return {Promise<User>} - Promise containing new user
   */
  async register(dto: RegisterUserDTO): Promise<User> {
    const user = await this.users.create(dto)

    await this.strategist.validateLocal(dto.email, dto.password)
    await this.verification.sendEmail(user)

    return user
  }
}

export default AuthService
