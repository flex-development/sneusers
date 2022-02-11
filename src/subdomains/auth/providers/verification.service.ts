import { ExceptionCode } from '@flex-development/exceptions/enums'
import { NullishString } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExceptionDataDTO } from '@sneusers/dtos'
import { Exception } from '@sneusers/exceptions'
import { User } from '@sneusers/subdomains/users/entities'
import { IUserRaw } from '@sneusers/subdomains/users/interfaces'
import { UsersService } from '@sneusers/subdomains/users/providers'
import { UserUid } from '@sneusers/subdomains/users/types'
import pick from 'lodash.pick'
import OPENAPI from '../controllers/openapi/verification.openapi'
import {
  RequestVerifDTO,
  RequestVerifResendDTO,
  VerifEmailSentDTO
} from '../dtos'
import { TokenType, VerifType } from '../enums'
import TokensService from './tokens.service'

/**
 * @file Auth Subdomain Providers - VerificationService
 * @module sneusers/subdomains/auth/providers/VerificationService
 */

@Injectable()
class VerificationService {
  constructor(
    protected readonly users: UsersService,
    protected readonly tokens: TokensService,
    protected readonly config: ConfigService
  ) {}

  /**
   * Checks if `type` is a valid {@link VerifType}.
   *
   * @template T - Aggregated error type
   *
   * @static
   * @param {any} [type] - Value to check
   * @param {ExceptionDataDTO<T>} [data={}] - Exception data if type is invalid
   * @return {boolean} `true` if type is valid
   * @throws {Exception}
   */
  static isVerifType<T = any>(
    type?: any,
    data: ExceptionDataDTO<T> = {}
  ): type is VerifType {
    if (!Object.values(VerifType).includes(type)) {
      const code = ExceptionCode.FORBIDDEN
      const message = 'Invalid verification type'

      throw new Exception<T>(code, message, data)
    }

    return true
  }

  /**
   * Checks if `type` is a valid {@link VerifType}.
   *
   * @template T - Aggregated error type
   *
   * @param {any} [type] - Value to check
   * @param {ExceptionDataDTO<T>} [data={}] - Exception data if type is invalid
   * @return {boolean} `true` if type is valid
   * @throws {Exception}
   */
  checkType<T = any>(
    type?: any,
    data: ExceptionDataDTO<T> = {}
  ): type is VerifType {
    return VerificationService.isVerifType<T>(type, data)
  }

  /**
   * Generates a raw verification token and verification token entity.
   *
   * @async
   * @param {Pick<IUserRaw, 'email' | 'id'>} user - User to create token for
   * @return {Promise<string>} Promise containing raw verification token
   */
  async createToken(user: Pick<IUserRaw, 'email' | 'id'>): Promise<string> {
    return await this.tokens.createVerificationToken(user)
  }

  /**
   * Resends user verification data.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to re-send email to
   * @param {RequestVerifResendDTO} dto - Data to res-send verification
   * @param {VerifType} dto.type - Verification type
   * @return {Promise<VerifEmailSentDTO>} Promise containg message and user ids
   * @throws {Exception}
   */
  async resend(
    uid: UserUid,
    dto: RequestVerifResendDTO
  ): Promise<VerifEmailSentDTO> {
    this.checkType(dto.type, { dto })
    return await this.resendEmail(uid)
  }

  /**
   * Resends a verification email to a user.
   *
   * @async
   * @param {UserUid} uid - Id or email of user to re-send email to
   * @return {Promise<VerifEmailSentDTO>} Promise containg message and user ids
   * @throws {Exception}
   */
  async resendEmail(uid: UserUid): Promise<VerifEmailSentDTO> {
    const user = await this.users.findOne(uid, {
      rejectOnEmpty: true
    })

    return await this.sendEmail(user!)
  }

  /**
   * Sends a verification email to a user.
   *
   * @async
   * @param {Pick<IUserRaw, 'email' | 'id'>} user - User to send email to
   * @return {Promise<VerifEmailSentDTO>} Promise containg message and user ids
   * @throws {Exception}
   */
  async sendEmail(
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

    const PATH = [this.config.get<string>('HOST'), OPENAPI.controller].join('/')
    const token = await this.createToken(user)

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
    this.checkType(dto.type, { dto })
    return await this.verifyEmail(dto.token)
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
    const token = await this.tokens.resolve(
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
    await this.tokens.revoke(token.token.id)

    return token.user
  }
}

export default VerificationService
