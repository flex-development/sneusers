import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import {
  LoginDTO,
  RequestVerifDTO,
  RequestVerifResendDTO,
  VerifEmailSentDTO
} from '@sneusers/subdomains/auth/dtos'
import { TokenType, VerifType } from '@sneusers/subdomains/auth/enums'
import { CreateUserDTO } from '@sneusers/subdomains/users/dtos'
import { User } from '@sneusers/subdomains/users/entities'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import { UserUid } from '@sneusers/subdomains/users/types'
import pick from 'lodash.pick'
import OPENAPI from '../controllers/openapi/auth.openapi'
import AuthTokensService from './auth-tokens.service'

/**
 * @file Auth Subdomain Providers - AuthService
 * @module sneusers/subdomains/auth/providers/AuthService
 */

@Injectable()
class AuthService {
  constructor(
    protected readonly users: UsersService,
    protected readonly tokens: AuthTokensService,
    protected readonly config: ConfigService
  ) {}

  /**
   * Retrieves the current {@link UsersService} instance.
   *
   * @return {AuthTokensService} `TokensService` instance
   */
  get _tokens(): AuthTokensService {
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
      const { user } = await this.tokens.validateToken(
        TokenType.REFRESH,
        refresh_token,
        uid
      )

      return user
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
   * Generates a new access token for a user.
   *
   * @async
   * @param {string} refresh_token - User refresh token
   * @return {Promise<LoginDTO>} Promise containing access token and user id
   */
  async refresh(refresh_token: string): Promise<LoginDTO> {
    const token = await this.tokens.resolveToken(
      TokenType.REFRESH,
      refresh_token
    )

    await this.tokens.revokeToken(token.token.id)

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
    let user = await this.users.create(dto)

    user = await this.authenticate(dto.email, dto.password || null)
    await this.sendVerificationEmail(user)

    return user
  }

  /**
   * Re-sends user verificationn data.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to re-send email to
   * @param {RequestVerifResendDTO} dto - Data to res-send verification
   * @param {VerifType} dto.type - Verification type
   * @return {Promise<VerifEmailSentDTO>} Promise containg message and user ids
   * @throws {Exception}
   */
  async resendVerification(
    uid: UserUid,
    dto: RequestVerifResendDTO
  ): Promise<VerifEmailSentDTO> {
    if (dto.type === VerifType.EMAIL) {
      return await this.resendVerificationEmail(uid)
    }

    throw new Exception(ExceptionCode.FORBIDDEN, 'Invalid verification type', {
      dto
    })
  }

  /**
   * Re-sends a verification email to a user.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to re-send email to
   * @return {Promise<VerifEmailSentDTO>} Promise containg message and user ids
   * @throws {Exception}
   */
  async resendVerificationEmail(uid: UserUid): Promise<VerifEmailSentDTO> {
    const user = await this.users.findOne(uid, {
      rejectOnEmpty: true
    })

    return await this.sendVerificationEmail(user!)
  }

  /**
   * Sends a verification email to a user.
   *
   * @async
   * @param {Pick<IUserRaw, 'email' | 'id'>} user - User to send email to
   * @return {Promise<VerifEmailSentDTO>} Promise containg message and user ids
   * @throws {Exception}
   */
  async sendVerificationEmail(
    user: Pick<IUserRaw, 'email' | 'id'>
  ): Promise<VerifEmailSentDTO> {
    user = (await this.users.findOne(user.id, { rejectOnEmpty: true })) as User

    if ((user as User).email_verified) {
      const code = ExceptionCode.FORBIDDEN
      const message = 'Email already verified'

      throw new Exception(code, message, {
        user: pick(user, ['email', 'email_verified', 'id'])
      })
    }

    const HOST = this.config.get<string>('HOST')
    const PATH = `${HOST}/${OPENAPI.controller}/${OPENAPI.verify.path}`
    const token = await this.tokens.createVerificationToken(user)

    const { email } = await this.users.sendEmail(user.email, {
      context: { url: `${PATH}?type=${VerifType.EMAIL}&token=${token}` },
      subject: 'Sneusers Email Confirmation',
      template: 'email/verification'
    })

    return { email: email.messageId, user: user.id }
  }

  /**
   * Confirms a user.
   *
   * @async
   * @param {RequestVerifDTO} dto - Data to verify user
   * @param {NullishString} [dto.token] - User verification token
   * @param {VerifType} dto.type - Verification type
   * @return {Promise<User>} Promise containing user
   * @throws {Exception}
   */
  async verify(dto: RequestVerifDTO): Promise<User> {
    if (dto.type === VerifType.EMAIL) return await this.verifyEmail(dto.token)

    throw new Exception(ExceptionCode.FORBIDDEN, 'Invalid verification type', {
      dto
    })
  }

  /**
   * Confirms a user's email address.
   *
   * @async
   * @param {NullishString} verification_token - User verification token
   * @return {Promise<User>} Promise containing user
   * @throws {Exception}
   */
  async verifyEmail(verification_token: NullishString): Promise<User> {
    const token = await this.tokens.resolveToken(
      TokenType.VERIFICATION,
      verification_token
    )

    if (token.user.email_verified) {
      const code = ExceptionCode.FORBIDDEN
      const message = 'Email already verified'

      throw new Exception(code, message, {
        user: pick(token.user, ['email', 'email_verified', 'id'])
      })
    }

    await this.users.verifyEmail(token.user.id)
    await this.tokens.revokeToken(token.token.id)

    return token.user
  }
}

export default AuthService
