import { OrNull } from '@flex-development/tutils'
import { ApiProperty } from '@nestjs/swagger'
import { CURRENT_TIMESTAMP } from '@sneusers/config/constants.config'
import { BaseEntity } from '@sneusers/entities'
import { DatabaseTable, ExceptionCode } from '@sneusers/enums'
import { Exception } from '@sneusers/exceptions'
import { RefreshTokenPayload } from '@sneusers/subdomains/auth/dtos'
import { IRefreshTokenRaw } from '@sneusers/subdomains/auth/interfaces'
import { User } from '@sneusers/subdomains/users/entities'
import {
  AllowNull,
  Column,
  Comment,
  DataType,
  Default,
  ForeignKey,
  Table,
  Validate
} from 'sequelize-typescript'
import isDate from 'validator/lib/isDate'

/**
 * @file Auth Subdomain Entities - RefreshToken
 * @module sneusers/subdomains/auth/entities/RefreshToken
 */

/**
 * [Data access object][1] for the {@link DatabaseTable.REFRESH_TOKENS} table.
 *
 * [1]: https://en.wikipedia.org/wiki/Data_access_object
 *
 * @extends {BaseEntity<IRefreshTokenRaw, Omit<IRefreshTokenRaw, 'id'>>}
 * @implements {IRefreshTokenRaw}
 */
@Table<RefreshToken>({
  hooks: {
    /**
     * Prepares a {@link RefreshToken} instance for validation.
     *
     * This includes:
     *
     * - Forcing the use of unix timestamps
     *
     * @param {RefreshToken} instance - Current user instance
     * @return {void} Nothing when complete
     */
    beforeValidate(instance: RefreshToken): void {
      const isNewRecord = !instance.id

      if (isNewRecord) {
        let expires = instance.dataValues.expires

        if (isDate(`${expires}`)) expires = new Date(expires).getTime()
        if (expires.toString() === CURRENT_TIMESTAMP) expires = Date.now()

        instance.dataValues.expires = expires || Date.now()
      }

      instance.isNewRecord = isNewRecord

      return
    }
  },
  omitNull: false,
  tableName: DatabaseTable.REFRESH_TOKENS,
  timestamps: false
})
class RefreshToken
  extends BaseEntity<IRefreshTokenRaw, Omit<IRefreshTokenRaw, 'id'>>
  implements IRefreshTokenRaw
{
  @ApiProperty({ description: 'When refresh token expires', type: Number })
  @Comment('when token expires (unix timestamp)')
  @Validate({ isUnixTimestamp: RefreshToken.checkUnixTimestamp })
  @AllowNull(false)
  @Default(CURRENT_TIMESTAMP)
  @Column('TIMESTAMP')
  declare expires: IRefreshTokenRaw['expires']

  @ApiProperty({ description: 'Revoked?', type: Boolean })
  @Comment('if token is revoked or not')
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare revoked: IRefreshTokenRaw['revoked']

  @ApiProperty({ description: 'Token owner', type: Number })
  @Comment('id of user who token belongs to')
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare user: IRefreshTokenRaw['id']

  /**
   * @static
   * @readonly
   * @property {(keyof IRefreshTokenRaw)[]} RAW_KEYS - Entity attributes
   */
  static readonly RAW_KEYS: (keyof IRefreshTokenRaw)[] = [
    'expires',
    'id',
    'revoked',
    'user'
  ]

  /**
   * Returns the associated {@link User} entity model.
   *
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
   * @param {RefreshTokenPayload} payload - Token payload
   * @return {Promise<OrNull<RefreshToken>>} - Promise containing refresh token
   * @throws {Exception}
   */
  static async findByPayload(
    payload: RefreshTokenPayload
  ): Promise<OrNull<RefreshToken>> {
    if (!payload.jti) {
      const code = ExceptionCode.NOT_IMPLEMENTED
      const message = 'Refresh token malformed'

      throw new Exception(code, message, payload)
    }

    return await this.findByPk(payload.jti, { rejectOnEmpty: false })
  }

  /**
   * Finds a token owner via payload.
   *
   * @static
   * @async
   * @param {RefreshTokenPayload} payload - Token payload
   * @return {Promise<OrNull<User>>} - Promise containing token owner
   * @throws {Exception}
   */
  static async findOwnerByPayload(
    payload: RefreshTokenPayload
  ): Promise<OrNull<User>> {
    if (!payload.sub) {
      const code = ExceptionCode.UNPROCESSABLE_ENTITY
      const message = 'Refresh token malformed'

      throw new Exception(code, message, payload)
    }

    return await this.User.findByPk(payload.sub, { rejectOnEmpty: false })
  }
}

export default RefreshToken
