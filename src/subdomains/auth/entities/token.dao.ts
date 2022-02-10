import { OrNull } from '@flex-development/tutils'
import { BaseEntity } from '@sneusers/entities'
import { DatabaseTable, ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { CreateTokenDTO, JwtPayload } from '@sneusers/subdomains/auth/dtos'
import { TokenType } from '@sneusers/subdomains/auth/enums'
import { IToken, ITokenRaw } from '@sneusers/subdomains/auth/interfaces'
import { User } from '@sneusers/subdomains/users/entities'
import { SearchOptions } from '@sneusers/types'
import {
  Column,
  Comment,
  DataType,
  Default,
  ForeignKey,
  Table,
  Validate
} from 'sequelize-typescript'
import type { Literal } from 'sequelize/types/lib/utils'
import isDate from 'validator/lib/isDate'

/**
 * @file Auth Subdomain Entities - Token
 * @module sneusers/subdomains/auth/entities/Token
 */

/**
 * [Data access object][1] for the {@link DatabaseTable.TOKENS} table.
 *
 * [1]: https://en.wikipedia.org/wiki/Data_access_object
 *
 * @see {@link TokenType}
 *
 * @extends {BaseEntity<ITokenRaw, CreateTokenDTO, IToken>}
 * @implements {IToken}
 */
@Table<Token>({
  deletedAt: false,
  hooks: {
    /**
     * Prepares a {@link Token} instance for validation.
     *
     * This includes:
     *
     * - Forcing the use of unix timestamps
     *
     * @static
     * @param {Token} instance - Current user instance
     * @return {void} Nothing when complete
     */
    beforeValidate(instance: Token): void {
      const isNewRecord = !instance.id

      if (isNewRecord) {
        const NOW = Token.CURRENT_TIMESTAMP

        let created_at = instance.dataValues.created_at

        if (isDate(`${created_at}`)) created_at = new Date(created_at).getTime()

        if ((NOW as Literal).val === created_at) created_at = Date.now()

        instance.dataValues.created_at = created_at || Date.now()
      }

      instance.isNewRecord = isNewRecord

      return
    }
  },
  omitNull: true,
  paranoid: false,
  tableName: DatabaseTable.TOKENS,
  timestamps: true,
  updatedAt: false
})
class Token
  extends BaseEntity<ITokenRaw, CreateTokenDTO, IToken>
  implements IToken
{
  @Comment('when user token created')
  @Validate({ isUnixTimestamp: Token.checkUnixTimestamp })
  @Default(Token.CURRENT_TIMESTAMP)
  @Column(DataType.BIGINT)
  declare created_at: IToken['created_at']

  @Comment('revoked?')
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare revoked: IToken['revoked']

  @Comment('time to live')
  @Default(86_400)
  @Column(DataType.BIGINT)
  declare ttl: IToken['ttl']

  @Comment('TokenType')
  @Column(DataType.ENUM(...Token.TYPES))
  declare type: IToken['type']

  @Comment('id of user who token belongs to')
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user: IToken['user']

  /**
   * Returns when the token expires.
   *
   * @return {number} When token expires (as unix timestamp)
   */
  @Column(DataType.VIRTUAL(DataType.BIGINT, ['created_at', 'ttl']))
  get expires(): IToken['expires'] {
    return this.created_at + this.ttl
  }

  /**
   * @static
   * @readonly
   * @property {(keyof ITokenRaw)[]} RAW_KEYS - {@link ITokenRaw} attributes
   */
  static readonly RAW_KEYS: (keyof ITokenRaw)[] = [
    'created_at',
    'id',
    'revoked',
    'ttl',
    'type',
    'user'
  ]

  /**
   * @static
   * @readonly
   * @property {ReadonlyArray<TokenType>} TYPES - Valid `Token#type` values
   */
  static readonly TYPES: ReadonlyArray<TokenType> = Object.freeze([
    ...Object.values(TokenType)
  ])

  /**
   * Returns the associated {@link User} entity model.
   *
   * @static
   * @return {typeof User} `User` entity model
   */
  static get User(): typeof User {
    return this.sequelize.models.User as typeof User
  }

  /**
   * Finds a token via payload.
   *
   * @static
   * @async
   * @param {JwtPayload} payload - JWT payload
   * @param {number} payload.jti - Id of assigned `Token`
   * @param {string} payload.sub - Id or email of `User` who token was issued to
   * @param {TokenType} payload.type - Token type
   * @param {SearchOptions<Token>} [options={}] - Search options
   * @return {Promise<OrNull<Token>>} - Promise containing token or `null`
   * @throws {Exception}
   */
  static async findByPayload(
    payload: JwtPayload,
    options: SearchOptions<Token> = {}
  ): Promise<OrNull<Token>> {
    const id = Number.parseInt(payload.jti)

    if (Number.isNaN(id) || id < 0 || !TokenType[payload.type]) {
      const code = ExceptionCode.UNPROCESSABLE_ENTITY
      throw new Exception(code, 'Token malformed', { payload })
    }

    const token = await this.findByPk(id, options)

    if (token && token.type !== payload.type) {
      throw new Exception(ExceptionCode.CONFLICT, 'Token type mismatch', {
        payload,
        token: { id: token.id, type: token.type }
      })
    }

    return token
  }

  /**
   * Finds a token owner via `payload`.
   *
   * If an owner is found, but doesn't match the user identified by `payload`,
   * an {@link Exception} will be thrown.
   *
   * @static
   * @async
   * @param {JwtPayload} payload - JWT payload
   * @param {number} payload.jti - Id of assigned `Token`
   * @param {string} payload.sub - Id or email of `User` who token was issued to
   * @param {TokenType} payload.type - Token type
   * @param {SearchOptions<User>} [options={}] - Search options
   * @return {Promise<User>} - Promise containing token owner
   * @throws {Exception}
   */
  static async findOwnerByPayload(
    payload: JwtPayload,
    options: SearchOptions<User> = {}
  ): Promise<User> {
    const sub = payload.sub
    const type = payload.type

    if (!sub || !type) {
      const code = ExceptionCode.UNPROCESSABLE_ENTITY
      throw new Exception(code, 'Token malformed', { payload })
    }

    const token = (await this.findByPk(payload.jti, { rejectOnEmpty: true }))!
    const user = (await this.User.findByPk(token.user, options))!

    // @ts-expect-error types 'string' and 'number' have no overlap
    const mismatch_id = type !== TokenType.VERIFICATION && sub != user.id
    const mismatch_email = type === TokenType.VERIFICATION && sub !== user.email

    if (mismatch_id || mismatch_email) {
      throw new Exception(ExceptionCode.UNAUTHORIZED, 'Token owner mismatch', {
        payload,
        token: token.toJSON(),
        user: { id: user.id }
      })
    }

    return user
  }
}

export default Token
