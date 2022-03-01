import { ExceptionCode } from '@flex-development/exceptions/enums'
import { OrNull } from '@flex-development/tutils'
import { Exception } from '@sneusers/exceptions'
import { Entity } from '@sneusers/modules/db/entities'
import {
  DatabaseSequence,
  DatabaseTable,
  OrderDirection,
  ReferentialAction
} from '@sneusers/modules/db/enums'
import { SearchOptions } from '@sneusers/modules/db/types'
import { User } from '@sneusers/subdomains/users/entities'
import {
  Column,
  DataType,
  ForeignKey,
  Sequelize,
  Table
} from 'sequelize-typescript'
import { CreateTokenDTO, JwtPayload } from '../dtos'
import { TokenType } from '../enums'
import { IToken, ITokenRaw } from '../interfaces'

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
 * @extends {Entity<ITokenRaw, CreateTokenDTO, IToken>}
 * @implements {IToken}
 */
@Table<Token>({
  defaultScope: {
    attributes: Token.KEYS,
    order: [['id', OrderDirection.ASC]],
    raw: false
  },
  deletedAt: false,
  hooks: {},
  omitNull: true,
  paranoid: false,
  tableName: DatabaseTable.TOKENS,
  timestamps: true,
  updatedAt: false
})
class Token
  extends Entity<ITokenRaw, CreateTokenDTO, IToken>
  implements IToken
{
  @Column({
    allowNull: false,
    defaultValue: Token.CURRENT_TIMESTAMP,
    type: DataType.BIGINT,
    validate: { isUnixTimestamp: Token.isUnixTimestamp }
  })
  declare created_at: IToken['created_at']

  @Column({
    allowNull: false,
    autoIncrementIdentity: true,
    defaultValue: Sequelize.fn('nextval', DatabaseSequence.TOKENS),
    primaryKey: true,
    type: 'NUMERIC',
    unique: { msg: 'token id must be unique', name: 'id' },
    validate: { notNull: true }
  })
  declare id: number

  @Column({ allowNull: false, defaultValue: false, type: DataType.BOOLEAN })
  declare revoked: IToken['revoked']

  @Column({ allowNull: false, defaultValue: 86_400, type: DataType.BIGINT })
  declare ttl: IToken['ttl']

  @Column({ allowNull: false, type: DataType.ENUM(...Token.TYPES) })
  declare type: IToken['type']

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    onDelete: ReferentialAction.CASCADE,
    type: 'NUMERIC'
  })
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
   * @property {(keyof ITokenRaw)[]} KEYS_RAW - {@link ITokenRaw} attributes
   */
  static readonly KEYS_RAW: (keyof ITokenRaw)[] = [
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
   * @property {(keyof IToken)[]} KEYS - {@link IToken} attributes
   */
  static readonly KEYS: (keyof IToken)[] = [...Token.KEYS_RAW, 'expires']

  /**
   * @static
   * @readonly
   * @property {ReadonlyArray<TokenType>} TYPES - Token types
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

    const mismatch =
      type === TokenType.VERIFICATION
        ? sub !== user.email
        : Number.parseInt(sub) !== user.id

    if (mismatch) {
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
